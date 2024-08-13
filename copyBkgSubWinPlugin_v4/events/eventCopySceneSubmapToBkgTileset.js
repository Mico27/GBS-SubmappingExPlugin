export const id = "EVENT_COPY_BKG_SUBMAP_TO_BKG_TILESET";
export const name = "Copy scene submap to background tileset";
export const groups = ["EVENT_GROUP_SCREEN"];

export const autoLabel = (fetchArg) => {
  return `Copy scene submap to background tileset`;
};

export const fields = [
  
  {
    key: "sceneId",
    label: "Scene",
    type: "scene",
	width: "100%",
    defaultValue: "LAST_SCENE",
	conditions: [
      {
        key: "use_far_ptr",
        ne: true
      },
    ],
  },
  {
    key: `scene_bank`,
    label: "Scene bank",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
	conditions: [
      {
        key: "use_far_ptr",
        eq: true
      },
    ],
  },
  {
    key: `scene_ptr`,
    label: "Scene Pointer",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
	conditions: [
      {
        key: "use_far_ptr",
        eq: true
      },
    ],
  },
  {
    key: "use_far_ptr",
    label: "Use scene's far ptr",
    type: "checkbox",
	width: "50%",
  },
  {
    key: `source_x`,
    label: "Source X",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
  {
    key: `source_y`,
    label: "Source Y",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
  {
    key: `dest_x`,
    label: "Destination X",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
  {
    key: `dest_y`,
    label: "Destination Y",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
  {
    key: "w",
    label: "width",
    description: "width",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
  {
    key: "h",
    label: "height",
    description: "height",
    type: "value",
    width: "50%",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
];

export const compile = (input, helpers) => {
  const { options, _callNative, _stackPushConst, _stackPush, _stackPop, _addComment, _declareLocal, variableSetToScriptValue } = helpers;
  
  const tmp0 = _declareLocal("tmp0", 1, true);
  const tmp1 = _declareLocal("tmp1", 1, true);
  const tmp2 = _declareLocal("tmp2", 1, true);
  const tmp3 = _declareLocal("tmp3", 1, true);
  const tmp4 = _declareLocal("tmp4", 1, true);
  const tmp5 = _declareLocal("tmp5", 1, true);  
  const tmp6 = _declareLocal("tmp6", 1, true);
  const tmp7 = _declareLocal("tmp7", 1, true);
  variableSetToScriptValue(tmp0, input.source_x);
  variableSetToScriptValue(tmp1, input.source_y);
  variableSetToScriptValue(tmp2, input.dest_x);
  variableSetToScriptValue(tmp3, input.dest_y);
  variableSetToScriptValue(tmp4, input.w);
  variableSetToScriptValue(tmp5, input.h);  
  
  _addComment("Copy scene submap to background tileset");
  if (input.use_far_ptr){
	 
	  variableSetToScriptValue(tmp6, input.scene_bank);
	  variableSetToScriptValue(tmp7, input.scene_ptr);	
	  _stackPush(tmp7);
	  _stackPush(tmp6);
	  //_stackPushConst(21953); 
	 // _stackPushConst(5);
  } else {
	const { scenes } = options;
	const scene = scenes.find((s) => s.id === input.sceneId);
	if (!scene) {
		return;
	}
	_stackPushConst(`_${scene.symbol}`);
	_stackPushConst(`___bank_${scene.symbol}`); 
  }
  _stackPush(tmp5);
  _stackPush(tmp4);
  _stackPush(tmp3);
  _stackPush(tmp2);
  _stackPush(tmp1);
  _stackPush(tmp0);
  		
  _callNative("copy_background_submap_to_background_tileset");
  _stackPop(8);  
  
};
