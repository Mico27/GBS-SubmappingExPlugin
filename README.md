# GBS-SubmappingExPlugin
 Plugin for partialy copying a scene to the overlay or background
 Also added events to set background/overlay tiles individualy

"Copy scene submap to background" will copy a section of the tilemap at a specified scene into the active scene background.
You can submap from the same scene as the active scene. Submapping from a different scene require both scene to have a matching common tileset.

<img width="671" height="151" alt="image" src="https://github.com/user-attachments/assets/bce9cd2c-9691-47c7-89a6-9181d3fa1bb5" />

"Copy scene submap to background with tile offset" will copy a section of the tilemap at a specified scene into the active scene background but will add an offset to all the tile ids copied.
This is useful if you are preloading the tileset used by the specified scene at a specified index in the current tileset and then submap the tilemap data of the specified scene to match the index diff.
The "Replace tileset Tiles" event is from the plugin https://github.com/Mico27/gbs-replaceTilesetTilesPlugin but you can also use GBVM and the operation VM_REPLACE_TILE instead.

<img width="669" height="319" alt="image" src="https://github.com/user-attachments/assets/4a979dc8-7bf1-4688-81d5-a0e00f9e5a74" />

"Copy scene submap to overlay" is the same as "Copy scene submap to background" but will copy to the active scene overlay.

<img width="672" height="158" alt="image" src="https://github.com/user-attachments/assets/f23be634-b278-4e06-ad5d-f254a67d4870" />

"Copy scene submap to overlay with tile offset" is the same as "Copy scene submap to background with tile offset" but will copy to the active scene overlay.

<img width="671" height="319" alt="image" src="https://github.com/user-attachments/assets/6de1d336-fbcc-4eb8-958d-3ed1a3fa308c" />

"Copy scene submap to background tileset" will make each unique tiles in the active scene background within the section specified to be replaced by tile data from a specified scene's section.

<img width="671" height="209" alt="image" src="https://github.com/user-attachments/assets/7b1da59c-67bf-4e2c-baed-028d95bce558" />
