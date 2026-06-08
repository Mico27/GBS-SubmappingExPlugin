# GBS-SubmappingExPlugin

**Version 4.3.0 — Requires GB Studio ≥ 4.3.0**

A GB Studio engine plugin that provides fine-grained control over the background and window/overlay tilemaps at runtime. It lets you copy rectangular sections of any compiled scene's tilemap into the active scene's background or overlay, optionally apply a tile index offset, blit raw pixel data from a source scene's tileset into the active VRAM tileset, and set individual tile slots on either layer by tile ID.

All events are in the **Screen** group of the script editor.

---

## Table of Contents

1. [Concepts](#concepts)
2. [Project Setup](#project-setup)
3. [Technicalities and Restrictions](#technicalities-and-restrictions)
4. [Events Reference](#events-reference)
5. [Inner Workings](#inner-workings)

---

## Concepts

### Tilemap vs. Tileset

The Game Boy renders the background and window layers by reading a **tilemap** — a 32×32 grid of 1-byte tile indices stored in VRAM — and looking up the corresponding 8×8 pixel pattern in the **tileset** (VRAM tile data at 0x8000–0x8FFF). GB Studio manages both when loading a scene, but normally a script cannot change either without fully reloading the scene.

This plugin adds the ability to:

- **Overwrite tilemap cells** — write new tile indices into specific cells of the background or overlay tilemap. Cheap and immediate, but the change is lost as soon as the scroll system redraws that row or column from the scene's ROM data.
- **Overwrite tileset pixels** — write new 8×8 pixel patterns into specific VRAM tile slots. More expensive (128 bytes per tile copied from ROM), but the change survives scrolling because the tile data itself is different; the tilemap still points to the same index.

### Source Scene as a Data Container

Any scene in your project whose tilemap and tileset are compiled into ROM can serve as a data source for submapping. The plugin reads the source scene's struct from ROM at runtime — no live scene state is involved. This makes it possible to use off-screen or never-visited scenes purely as repositories of tile art.

### Far Pointer Mode

Every submap event supports a **Use scene's far ptr** toggle. When unchecked the event uses a standard scene picker and the compiler resolves the scene's bank and pointer at compile time. When checked you can supply the bank number and pointer value from variables at runtime, enabling dynamic scene selection (e.g. picking different tile sheets from a variable).

---

## Project Setup

### For Tilemap Submapping (background / overlay copy)

1. Design the source scene with the same common tileset as the active scene, **or** plan for a tile index offset that maps the source scene's tile IDs to slots already loaded in the active scene's VRAM.
2. In the script where you want the copy to happen, call **Copy scene submap to background** (or overlay) and specify the source scene, the rectangular region to copy, and the destination position.
3. If the source scene uses a different tileset, use the **with tile offset** variant and pre-load the source tileset tiles into the active scene's VRAM at the matching offset (e.g. using the [replaceTilesetTiles plugin](https://github.com/Mico27/gbs-replaceTilesetTilesPlugin) or the `VM_REPLACE_TILE` GBVM operation).

### For Tileset Submapping (permanent pixel replacement)

1. Design both the source scene and the active scene so that the tiles you want to replace share the **same tile indices** in the tilemap (the active scene's tiles at the destination coordinates will be overwritten with the source scene's pixel data).
2. Call **Copy scene submap to background tileset**. The plugin walks every cell in the specified region, reads the source tile's pixel data from ROM, and writes it into the VRAM slot that the active scene currently uses at that coordinate. The change persists until a scene reload because the VRAM data itself is modified.

### For Individual Tile Writes

No special setup is needed. Call **Set background tile** or **Set overlay tile** at any time, providing the tilemap X/Y coordinate (in tile units) and the tile ID to write.

---

## Technicalities and Restrictions

### Tilemap Changes Reset on Scroll

Background tilemap writes made by the plain submap events (**Copy scene submap to background**, **Copy scene submap to background with tile offset**, **Set background tile**) are written directly into VRAM tilemap memory. GB Studio's scroll engine redraws rows and columns from the scene's original ROM data whenever that area scrolls off-screen. This means the change will be overwritten the next time that row/column is refreshed by the scroll system. Use these events for tiles that will never scroll off during the relevant game state, or accept the reset behaviour.

**Overlay tilemap changes and tileset changes do not reset on scroll.** The window/overlay layer is not managed by the scroll engine, so changes written there persist. Tileset pixel writes replace the data at the VRAM tile slot, so even when the scroll engine redraws the tilemap it looks up the modified pixel data.

### Common Tileset Requirement (without offset)

When using the plain copy events (no tile offset), both the source scene and the active scene must share the same common tileset so that tile indices mean the same thing in both contexts. Submapping from a scene with a different tileset without an offset will produce the wrong tiles.

### Tile Offset Use Case

The **with tile offset** variants add a constant integer to every tile index copied from the source scene. This is designed for situations where you load a source scene's tileset into the active scene's VRAM at a known slot offset and then copy its tilemap data shifted by that offset so the indices point to the correct newly loaded slots.

### CGB Attribute Map

All events fully support CGB hardware. Where applicable the plugin switches to VRAM bank 1 (`VBK_REG = 1`) to copy or write the CGB tile attribute bytes (palette, priority, flip flags) alongside the tile indices in bank 0. On DMG hardware the CGB code paths are compiled out.

### Tile Coordinates Wrap at 32

All X and Y tile coordinates passed to the underlying GBDK functions are masked to 5 bits (`& 31`), matching the 32×32 tile VRAM map size. Values outside 0–31 wrap around.

---

## Events Reference

All events are in the **Screen** group.

---

### Copy scene submap to background

**`EVENT_COPY_BKG_SUBMAP_TO_BKG`**

Copies a rectangular region of tile indices (and CGB attributes on GBC) from a source scene's ROM tilemap directly into the active scene's background VRAM tilemap.

> Changes reset when the affected rows/columns scroll off-screen and are redrawn.

| Field | Description |
|-------|-------------|
| Scene | The source scene to read tile data from. |
| Use scene's far ptr | When checked, supply Scene bank and Scene Pointer from variables instead of the scene picker. |
| Source X / Source Y | Top-left tile coordinate in the source scene's tilemap. |
| Destination X / Destination Y | Top-left tile coordinate in the active scene's background tilemap. |
| Width / Height | Size of the region to copy in tiles. |

<img width="671" height="151" alt="image" src="https://github.com/user-attachments/assets/bce9cd2c-9691-47c7-89a6-9181d3fa1bb5" />

---

### Copy scene submap to background with tile offset

**`EVENT_COPY_BKG_SUBMAP_TO_BKG_BASE`**

Same as **Copy scene submap to background** but adds a constant integer to every tile index read from the source scene before writing it to the background tilemap. Use this when the source scene's tiles have been pre-loaded into the active scene's VRAM at a known offset.

| Field | Description |
|-------|-------------|
| Scene | The source scene. |
| Use scene's far ptr | Dynamic scene bank/pointer via variables. |
| Source X / Source Y | Top-left tile coordinate in the source scene. |
| Destination X / Destination Y | Top-left destination in the active scene's background tilemap. |
| Width / Height | Region size in tiles. |
| Tile idx offset | Value added to every tile index copied from the source tilemap. |

<img width="669" height="319" alt="image" src="https://github.com/user-attachments/assets/4a979dc8-7bf1-4688-81d5-a0e00f9e5a74" />

---

### Copy scene submap to overlay

**`EVENT_COPY_BKG_SUBMAP_TO_WIN`**

Copies a rectangular region from a source scene's ROM tilemap into the active scene's **window/overlay** VRAM tilemap. Uses separate source (Background X/Y) and destination (Overlay X/Y) coordinates.

> Overlay changes persist across scrolling.

| Field | Description |
|-------|-------------|
| Scene | The source scene. |
| Use scene's far ptr | Dynamic scene bank/pointer via variables. |
| Background X / Background Y | Top-left tile coordinate in the source scene's tilemap. |
| Overlay X / Overlay Y | Top-left destination in the overlay tilemap. |
| Width / Height | Region size in tiles. |

<img width="672" height="158" alt="image" src="https://github.com/user-attachments/assets/f23be634-b278-4e06-ad5d-f254a67d4870" />

---

### Copy scene submap to overlay with tile offset

**`EVENT_COPY_BKG_SUBMAP_TO_WIN_BASE`**

Same as **Copy scene submap to overlay** but adds a constant integer to every tile index before writing to the overlay tilemap.

| Field | Description |
|-------|-------------|
| Scene | The source scene. |
| Use scene's far ptr | Dynamic scene bank/pointer via variables. |
| Background X / Background Y | Source tile coordinate in the source scene. |
| Overlay X / Overlay Y | Destination in the overlay tilemap. |
| Width / Height | Region size in tiles. |
| Tile idx offset | Value added to every tile index copied. |

<img width="671" height="319" alt="image" src="https://github.com/user-attachments/assets/6de1d336-fbcc-4eb8-958d-3ed1a3fa308c" />

---

### Copy scene submap to background tileset

**`EVENT_COPY_BKG_SUBMAP_TO_BKG_TILESET`**

For every tile cell in the specified region, reads the **pixel data** (8×8 bitmaps, 16 bytes per tile) of the corresponding source tile from the source scene's tileset in ROM and writes it into the VRAM tile slot that the active scene's tilemap currently references at that destination cell. This replaces the actual pixel art in VRAM rather than the tilemap index.

> Changes survive scrolling because the tile pixel data itself is modified. They reset only on scene reload.

Optionally also copies the CGB tile attribute bytes from the source tilemap onto either the background or overlay attribute map.

| Field | Description |
|-------|-------------|
| Scene | The source scene whose tileset pixel data to copy from. |
| Use scene's far ptr | Dynamic scene bank/pointer via variables. |
| Source X / Source Y | Top-left tile coordinate in the source scene's tilemap. |
| Destination X / Destination Y | Top-left destination in the active scene. The tile IDs at these positions in the active scene's tilemap determine which VRAM slots are overwritten. |
| Width / Height | Region size in tiles. |
| Copy tile attributes to | `None` — skip attribute copy; `Background` — copy CGB palette/flip attributes to the background attribute map; `Overlay` — copy them to the overlay attribute map at the position specified by Overlay X/Y. |
| Overlay X / Overlay Y | Destination in the overlay attribute map (only used when copying attributes to overlay). |

<img width="671" height="209" alt="image" src="https://github.com/user-attachments/assets/7b1da59c-67bf-4e2c-baed-028d95bce558" />

---

### Set background tile

**`EVENT_REPLACE_BACKGROUND_TILE`**

Writes a single tile ID into one cell of the background VRAM tilemap at the given tile coordinates. Unlike GB Studio's built-in **Replace tile at position**, this writes only the specific cell — it does not find and replace all cells that currently share the same tile index.

> Resets when the scroll engine redraws that row/column.

| Field | Description |
|-------|-------------|
| X | Tile column (wraps at 32). |
| Y | Tile row (wraps at 32). |
| Tile id | The tile index to write into this cell. |

<img width="666" height="92" alt="image" src="https://github.com/user-attachments/assets/b1aa6367-4cb4-4424-a0fe-e7bacc890903" />

---

### Set overlay tile

**`EVENT_REPLACE_OVERLAY_TILE`**

Writes a single tile ID into one cell of the window/overlay VRAM tilemap.

> Persists across scrolling.

| Field | Description |
|-------|-------------|
| X | Tile column (wraps at 32). |
| Y | Tile row (wraps at 32). |
| Tile id | The tile index to write into this cell. |

<img width="669" height="92" alt="image" src="https://github.com/user-attachments/assets/fb9876d8-88d7-49fb-8502-596ba2423d02" />

---

## Inner Workings

### Reading Source Scene Data from ROM

All submap functions begin the same way: they receive the source scene's ROM bank number and pointer as arguments, use `MemcpyBanked` to read the `scene_t` struct into a local variable, then read the embedded `background_t` struct to obtain separate banked pointers to the tilemap, CGB attribute map, and tileset. All subsequent reads use the bank number stored in each of those pointers, meaning the data can span any ROM bank.

### Tilemap Copy Path (plain and overlay)

`copy_background_submap_to_background` and `copy_background_submap_to_overlay` iterate row by row over the region. For each row:

1. The source row offset is computed as `(source_y + i) * bkg.width + source_x`.
2. `MemcpyBanked` copies `width` bytes from the source tilemap into a 32-byte stack buffer (`tmp_tile_buffer`).
3. On CGB hardware, steps 2 and the corresponding VRAM bank-1 write are repeated for the attribute map.
4. `set_bkg_tiles` / `set_win_tiles` (GBDK) writes the buffer to the VRAM tilemap at the destination row.

The overlay (window) variant uses `set_xy_win_submap`, an assembly helper that maps straight to the GB hardware window tilemap.

### Tile Offset Path

`copy_background_submap_to_background_base` and `copy_background_submap_to_overlay_base` use `set_bkg_based_tiles` / `set_win_based_tiles` in place of the plain GBDK tile setters. These GBDK functions add a base offset to every tile byte before writing to VRAM, implementing the tile index shift without a separate loop. Positions and dimensions are packed into `int16` values by the compiler's RPN stage (`(y << 8) | x`, `(h << 8) | w`) to reduce the number of VM stack arguments needed.

### Tileset Copy Path

`copy_background_submap_to_tileset` walks every individual cell in the region. For each cell `(j, i)`:

1. It reads `dest_tile` — the tile index currently in the active scene's tilemap at `(dest_x + j, dest_y + i)` — from ROM via `ReadBankedUBYTE`. This is the VRAM slot that will be overwritten.
2. It reads `source_tile` — the tile index in the source scene's tilemap at `(source_x + j, source_y + i)`.
3. If the UI-reserved offset applies (`n_tiles` between 129 and 191) and `source_tile ≥ 128`, the index is adjusted down.
4. On CGB hardware, if the source has a separate CGB tileset (`cgb_tileset`) and the source attribute has the VRAM bank 1 flag set (`source_attr & 0x08`), the CGB tile data is read from `cgb_tileset` instead of the main tileset. The target VRAM bank is chosen by checking `dest_attr & 0x08` (whether the destination cell uses VRAM bank 1).
5. `SetBankedBkgData` copies the 16-byte tile bitmap from ROM tileset into the VRAM slot `dest_tile`.
6. If **copy tile attributes** is enabled, `set_bkg_tile_xy` or `set_win_tile_xy` in VRAM bank 1 writes the CGB attribute byte, preserving the destination's existing VRAM-bank flag while taking palette/flip data from the source.

### Single-Tile Write Path

`vm_replace_background_tile` and `vm_replace_overlay_tile` are thin wrappers around `set_bkg_tile_xy` and `set_win_tile_xy` (GBDK), each masking the X and Y coordinates to `& 31` before calling through. No buffering or iteration is involved — the write is a direct single VRAM byte update.
