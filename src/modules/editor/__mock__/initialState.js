const initialStateComplex = {
  nodes: [
    {
      name: 'Vaccine',
      pos: {
        x: 1027,
        y: 313
      },
      type: 'model',
      selected: false
    },
    {
      name: 'ShotOrder',
      pos: {
        x: 426,
        y: 605
      },
      type: 'model',
      selected: false
    },
    {
      name: 'Campaign',
      pos: {
        x: 844,
        y: 50
      },
      type: 'model',
      selected: false
    },
    {
      name: 'unity',
      pos: {
        x: 323.5,
        y: 332
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'company',
      pos: {
        x: 240,
        y: 619
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'Company',
      pos: {
        x: 147,
        y: 453
      },
      type: 'model',
      selected: false
    },
    {
      name: 'Unity',
      pos: {
        x: 164,
        y: 243
      },
      type: 'model',
      selected: false
    },
    {
      name: 'ApplicationPlace',
      pos: {
        x: 505,
        y: 204
      },
      type: 'model',
      selected: false
    },
    {
      name: 'cdaLot',
      pos: {
        x: 841.5,
        y: 633
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'CdaLot',
      pos: {
        x: 989,
        y: 531
      },
      type: 'model',
      selected: false
    },
    {
      name: 'vaccine',
      pos: {
        x: 872,
        y: 401
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'Person',
      pos: {
        x: 701,
        y: 489
      },
      type: 'model',
      selected: false
    },
    {
      name: 'shotOrder',
      pos: {
        x: 603.5,
        y: 641.5
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'applicationPlace',
      pos: {
        x: 568.5,
        y: 387.5
      },
      type: 'relation',
      selected: false
    },
    {
      name: 'ShotPackage',
      pos: {
        x: 691,
        y: 268
      },
      type: 'model',
      selected: false
    },
    {
      name: 'shotPackages',
      pos: {
        x: 649.5,
        y: 86.5
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasMany'
    },
    {
      name: 'vaccines',
      pos: {
        x: 881.5,
        y: 232
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasMany'
    },
    {
      name: 'applicationPlaces',
      pos: {
        x: 430.5,
        y: 444
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasMany'
    }
  ],
  edges: [
    {
      type: 'hasMany',
      nodes: [
        'Campaign',
        'vaccines'
      ],
      points: [
        905,
        111,
        926.5,
        277
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'vaccines',
        'Vaccine'
      ],
      points: [
        926.5,
        277,
        1088,
        374
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Company',
        'unity'
      ],
      points: [
        208,
        514,
        368.5,
        377
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'unity',
        'Unity'
      ],
      points: [
        368.5,
        377,
        225,
        304
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'ApplicationPlace',
        'unity'
      ],
      points: [
        566,
        265,
        368.5,
        377
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'ShotOrder',
        'company'
      ],
      points: [
        487,
        666,
        285,
        664
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'company',
        'Company'
      ],
      points: [
        285,
        664,
        208,
        514
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'vaccine'
      ],
      points: [
        762,
        550,
        917,
        446
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'vaccine',
        'Vaccine'
      ],
      points: [
        917,
        446,
        1088,
        374
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'applicationPlace'
      ],
      points: [
        762,
        550,
        613.5,
        432.5
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'applicationPlace',
        'ApplicationPlace'
      ],
      points: [
        613.5,
        432.5,
        566,
        265
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'cdaLot'
      ],
      points: [
        762,
        550,
        886.5,
        678
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'cdaLot',
        'CdaLot'
      ],
      points: [
        886.5,
        678,
        1050,
        592
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'CdaLot',
        'vaccine'
      ],
      points: [
        1050,
        592,
        917,
        446
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'ShotOrder',
        'applicationPlaces'
      ],
      points: [
        487,
        666,
        475.5,
        489
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'applicationPlaces',
        'ApplicationPlace'
      ],
      points: [
        475.5,
        489,
        566,
        265
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'ApplicationPlace',
        'shotPackages'
      ],
      points: [
        566,
        265,
        694.5,
        131.5
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'shotPackages',
        'ShotPackage'
      ],
      points: [
        694.5,
        131.5,
        752,
        329
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'ShotPackage',
        'vaccine'
      ],
      points: [
        752,
        329,
        917,
        446
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'shotOrder'
      ],
      points: [
        762,
        550,
        648.5,
        686.5
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'shotOrder',
        'ShotOrder'
      ],
      points: [
        648.5,
        686.5,
        487,
        666
      ]
    }
  ],
  stage: {
    pos: {
      x: 0,
      y: 0
    }
  },
  connector: {
    isConnecting: false,
    connectedTo: null
  }
}

const initialStateSimple = {
  nodes: [],
  edges: [],
  stage: { pos: { x: -1, y: 0 } }
}

export default initialStateComplex;
