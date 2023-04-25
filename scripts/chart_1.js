d3.dsv(';', 'data/dataset.csv', d3.autoType).then(data => {
  data = data.filter(d => d.estado_del_contacto == 'Cerrado')
  data.forEach(function(d) {
    if (d.fecha_cierre_contacto.includes(" ")) {
      d.fecha_cierre_contacto = d.fecha_cierre_contacto.substring(0, d.fecha_cierre_contacto.indexOf(" "));
    }
  });
  const parseTime = d3.timeParse('%d/%m/%Y')
  data.forEach(function(d) {
      d.fecha_ingreso = parseTime(d.fecha_ingreso);
      d.fecha_cierre_contacto = parseTime(d.fecha_cierre_contacto);
      d.diff = d3.timeDay.count(d.fecha_ingreso, d.fecha_cierre_contacto);
  });

  let data2 = d3.bin()
    .value(d => d.diff)(data)
    .map(d => {
      return {cant: d.length, diffDesde: d.x0, diffHasta: d.x1}
    })
    .sort((a, b) => b.diffHasta - a.diffDesde)
  console.log(data2)
  let chart = Plot.plot({
    marks: [
      //Plot.ruleY([80]),
      Plot.ruleX([-0.5]),
      Plot.barX(data2.filter(d => d.diffHasta > 10), { 
        x: 'diffHasta',
        y: 'cant',
        thresholds: 8,
        fill: 'diffHasta',
        fillOpacity: 0.6,
        stroke: 'diffHasta',
        strokeOpacity: 1,
        strokeWidth: 0.6,
        title: (d) => `Cantidad de denuncias: ${d.cant}`, 
        sort: {y: 'x', reverse:true},
      }),
      Plot.text(data2.filter(d=>d.diffHasta>100), {
        x: d => d.diffHasta + 2,
        y: d => d.cant,
        text: d => d3.format('.0f')(d.diffHasta),
        fill: 'diffHasta',
        textAnchor: 'start',
        fontWeight: 'bold',
        fontSize: 14,
      }),
      Plot.axisX({
        label: 'Días que tardó en resolverse →',
        labelOffset: 40,
        fontSize: 13,
        tickFormat: null,
        ticks: 8,
      }),
      Plot.axisY({
        label:null,
        labelOffset: 44,
        fontSize: 13,
        ticks: ([]),
        tickFormat: null,
       
      }),
    ],
    x: {
      domain: [1, d3.max(data2, d => d.diffHasta)],
    },
    color: {
      scheme: 'gnbu',
      pivot: 55,
    },
    fontFamily: 'sans-serif',
    zero: false,
    width: 450,
    height: 400,
    insetLeft: 10,
    insetRight: 10,
    insetTop: 0,
    marginBottom: 47,
    marginLeft: 47,
    })
    d3.select('#chart_1').append(() => chart)
})