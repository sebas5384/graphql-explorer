const initialState = {
  nodes: [
    {
      name: "Comment",
      pos: { x: 659, y: 547 },
      selected: false,
      type: "model"
    },
    { name: "Post", pos: { x: 636, y: 145 }, selected: false, type: "model" },
    { name: "Rank", pos: { x: 378, y: 538 }, selected: false, type: "model" },
    { name: "Image", pos: { x: 252, y: 402 }, selected: false, type: "model" },
    { name: "User", pos: { x: 465, y: 231 }, selected: false, type: "model" },
    { name: "author", pos: { x: 300, y: 140 }, selected: false, type: "relation" },
    { name: "posts", pos: { x: 200, y: 100 }, selected: false, type: "relation" },
  ],
  edges: [
    {
      nodes: ["Post", "author"],
      type: "hasOne",
      points: [466, 231, 636, 145]
    },
    {
      nodes: ["author", "User"],
      type: "hasOne",
      points: [636, 145, 466, 231]
    },
    {
      nodes: ["User", "posts"],
      type: "hasMany",
      points: [466, 231, 636, 145]
    },
    {
      nodes: ["posts", "Post"],
      type: "hasMany",
      points: [636, 145, 466, 231]
    },
  ],
  stage: { pos: { x: -1, y: 0 } }
};
export default initialState;
