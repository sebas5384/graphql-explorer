const initialStateComplex = {
  nodes: [
    {
      name: 'ApplicationPlace',
      pos: {
        x: -52,
        y: 320
      },
      type: 'model',
      selected: false
    },
    {
      name: 'Company',
      pos: {
        x: -479,
        y: 497
      },
      type: 'model',
      selected: false
    },
    {
      name: 'applicationPlaces',
      pos: {
        x: -136.5,
        y: 537
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasMany'
    },
    {
      name: 'unity',
      pos: {
        x: -313.5,
        y: 336
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'applicationPlace',
      pos: {
        x: 50.5,
        y: 563.5
      },
      type: 'model',
      selected: false
    },
    {
      name: 'cdaLot',
      pos: {
        x: 465.5,
        y: 721
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'CdaLot',
      pos: {
        x: 465,
        y: 523
      },
      type: 'model',
      selected: false
    },
    {
      name: 'Vaccine',
      pos: {
        x: 473,
        y: 332
      },
      type: 'model',
      selected: false
    },
    {
      name: 'Campaign',
      pos: {
        x: 471,
        y: 139
      },
      type: 'model',
      selected: false
    },
    {
      name: 'vaccines',
      pos: {
        x: 319.5,
        y: 217
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasMany'
    },
    {
      name: 'vaccine',
      pos: {
        x: 278,
        y: 540
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'ShotPackage',
      pos: {
        x: 213,
        y: 393
      },
      type: 'model',
      selected: false
    },
    {
      name: 'shotPackages',
      pos: {
        x: 103.5,
        y: 268.5
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasMany'
    },
    {
      name: 'company',
      pos: {
        x: -317,
        y: 563
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'ShotOrder',
      pos: {
        x: -217,
        y: 721
      },
      type: 'model',
      selected: false
    },
    {
      name: 'shotOrder',
      pos: {
        x: -16.5,
        y: 751.5
      },
      type: 'relation',
      selected: false,
      cardinality: 'hasOne'
    },
    {
      name: 'Person',
      pos: {
        x: 223,
        y: 734
      },
      type: 'model',
      selected: true
    },
    {
      name: 'Unity',
      pos: {
        x: -139,
        y: 177
      },
      type: 'model',
      selected: false
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
        471,
        139,
        319.5,
        217
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'vaccines',
        'Vaccine'
      ],
      points: [
        319.5,
        217,
        473,
        332
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Company',
        'unity'
      ],
      points: [
        -479,
        497,
        -313.5,
        336
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'unity',
        'Unity'
      ],
      points: [
        -313.5,
        336,
        -139,
        177
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'ApplicationPlace',
        'unity'
      ],
      points: [
        -52,
        320,
        -313.5,
        336
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'ShotOrder',
        'company'
      ],
      points: [
        -217,
        721,
        -317,
        563
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'company',
        'Company'
      ],
      points: [
        -317,
        563,
        -479,
        497
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'vaccine'
      ],
      points: [
        223,
        734,
        278,
        540
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'vaccine',
        'Vaccine'
      ],
      points: [
        278,
        540,
        473,
        332
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'applicationPlace'
      ],
      points: [
        223,
        734,
        50.5,
        563.5
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'applicationPlace',
        'ApplicationPlace'
      ],
      points: [
        50.5,
        563.5,
        -52,
        320
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'cdaLot'
      ],
      points: [
        223,
        734,
        465.5,
        721
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'cdaLot',
        'CdaLot'
      ],
      points: [
        465.5,
        721,
        465,
        523
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'CdaLot',
        'vaccine'
      ],
      points: [
        465,
        523,
        278,
        540
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'ShotOrder',
        'applicationPlaces'
      ],
      points: [
        -217,
        721,
        -136.5,
        537
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'applicationPlaces',
        'ApplicationPlace'
      ],
      points: [
        -136.5,
        537,
        -52,
        320
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'ApplicationPlace',
        'shotPackages'
      ],
      points: [
        -52,
        320,
        103.5,
        268.5
      ]
    },
    {
      type: 'hasMany',
      nodes: [
        'shotPackages',
        'ShotPackage'
      ],
      points: [
        103.5,
        268.5,
        213,
        393
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'ShotPackage',
        'vaccine'
      ],
      points: [
        213,
        393,
        278,
        540
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'Person',
        'shotOrder'
      ],
      points: [
        223,
        734,
        -16.5,
        751.5
      ]
    },
    {
      type: 'hasOne',
      nodes: [
        'shotOrder',
        'ShotOrder'
      ],
      points: [
        -16.5,
        751.5,
        -217,
        721
      ]
    }
  ],
  stage: {
    pos: {
      x: 587,
      y: -96
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
