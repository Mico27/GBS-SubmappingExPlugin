# GBS-copyBkgSubWinPlugin
 Plugin for partialy copying a scene to the overlay

 if you are using GBS v4 use the v4 plugin version
if you are using GBS v3 use the v3 plugin version (this one does not support variables in parameters)
 
There's 2 version of the event. If you're using the common tileset between the scene you are copying from, use the "Copy background submap to overlay" event, if you are not using a common tileset between the scenes, use the "Copy background submap to overlay with tile offset" with some GBVM to put the tileset offset so that it doesnt conflict with the first scene tileset (should be the same offset that you pass to the event like so (see image)).

![image](https://github.com/Mico27/GBS-copyBkgSubWinPlugin/assets/32064874/3c1b750b-a651-4602-b385-414d8b82724c)

There's also a version of the event that allows to copy part of the background of another scene to the current scene background.

