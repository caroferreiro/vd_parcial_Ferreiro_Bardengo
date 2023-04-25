d3.dsv(';', 'data/dataset_dic.csv', d3.autoType).then(data_dic => {

  var parseTime = d3.timeParse('%d/%m/%Y');
  data_dic.forEach(function(d) {
  d.fecha_ingreso = parseTime(d.fecha_ingreso);
  })

  var formatMonth = d3.timeFormat('%m');
    data_dic.forEach(function(d) {
    d.mes = formatMonth(d.fecha_ingreso);
  });

  var formatDay = d3.timeFormat('%d');
    data_dic.forEach(function(d) {
    d.dia = formatDay(d.fecha_ingreso);
  });

  const datos_abiertos = data_dic.filter(d => d.estado_del_contacto == 'Abierto' && d.mes == 12);
  
  // Encontrar la cantidad máxima de casos abiertos en un día dado
  const casos_maximos_por_dia = [];
  for (let dia = 1; dia <= 31; dia++) {
  const casos_abiertos = datos_abiertos.filter(d => d.dia == dia).length;
  casos_maximos_por_dia.push(casos_abiertos);
  }
  console.log(casos_maximos_por_dia)

    let dic_A = data_dic.filter(d => d.estado_del_contacto == 'Abierto');
    let chart = Plot.plot({
      marks: [
        Plot.ruleX([0]),
        Plot.ruleY([0]),
        Plot.line(dic_A, Plot.binX({y:'count'}, {
          x: 'dia',
          stroke: 'mes',
          strokeWidth: 4,
        })),
        Plot.axisX({
          label: 'Días del mes →',
          labelOffset: 35,
          fontSize: 13,
          ticks: 20,
        }),
        Plot.axisY({
          label: 'Cantidad de denuncias abiertas ↑',
          labelOffset: 27,
          fontSize: 13,
          ticks: 6,
        }),
      ],
      x: {
        domain: [1, 31],
      },
      color: {
        range: ['#2b8cbe']
      },
      fontFamily: 'sans-serif',
      width: 500,
      height: 370,
      insetLeft: 10,
      insetRight: 10,
      insetTop: 10,
      marginBottom: 40,
      marginLeft: 30,
      })
      d3.select('#chart_3').append(() => chart)
  })
