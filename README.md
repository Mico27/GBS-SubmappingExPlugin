# GBS-SubmappingExPlugin
 Plugin for partialy copying a scene to the overlay or background
 Also added events to set background/overlay tiles individualy

if you are using GBS v4 use the v4 plugin version

if you are using GBS v3 use the v3 plugin version (this one does not support variables in parameters)
 
There's 2 version of the event. If you're using the common tileset between the scene you are copying from, use the "Copy scene submap to overlay" or "Copy scene submap to background" event, if you are not using a common tileset between the scenes, use the "Copy scene submap to overlay with tile offset" or "Copy scene submap to background with tile offset".

The "Copy scene submap to background tileset" event allows you to do unique tile replacement, by copying the tileset of the scene submap and applying it to the current scene tileset.

![image](https://github.com/user-attachments/assets/7adaecd0-f37a-40b9-b71b-0aa801a8d27d)
![image](https://github.com/user-attachments/assets/7297cb88-d97f-4262-8f25-19c6415ce299)
![image](https://github.com/user-attachments/assets/44a44391-076f-4c3a-b16c-f67834599114)
![image](https://github.com/user-attachments/assets/fd79e9b2-e07c-4775-8fdc-fbdcdf4dda87)
![image](https://github.com/user-attachments/assets/328445ef-aa6b-41d9-b903-25fd635b7f6a)

"Copy scene submap to background tileset" now has the option to specify the pointer/bank address of the scene for dynamic loading
![image](https://github.com/user-attachments/assets/0ce607ac-9a76-46fd-81e0-271803c04185)
