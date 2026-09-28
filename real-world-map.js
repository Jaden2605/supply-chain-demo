const routeTwinLiveLocations = {
  chips: [25.03, 121.56],
  casings: [10.82, 106.63],
  aurora: [-33.86, 151.21],
  brilliant: [1.29, 103.85],
  factory: [-27.47, 153.03],
  warehouse: [51.92, 4.48],
  retail: [40.71, -74.01]
};

document.querySelector('#network').outerHTML =
  '<div id="network" aria-label="Interactive world map of Aurora Electronics supply chain"></div>';

const routeTwinLiveMap = L.map('network', {
  worldCopyJump: true,
  minZoom: 2,
  maxZoom: 12,
  zoomControl: true
}).setView([18, 101], 2);

L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }
).addTo(routeTwinLiveMap);

let routeTwinLiveLayers = [];

function routeTwinClearLiveMap() {
  routeTwinLiveLayers.forEach(layer => routeTwinLiveMap.removeLayer(layer));
  routeTwinLiveLayers = [];
}

function routeTwinLiveIcon(node, affected) {
  const symbol =
    node.type === 'port' ? '⚓' :
    node.type === 'factory' ? '⚙' :
    node.type === 'supplier' ? '◆' :
    node.type === 'warehouse' ? '▣' : '⌂';

  const color =
    affected ? '#dc5151' :
    node.type === 'supplier' ? '#10a879' :
    node.type === 'port' ? '#ee972d' :
    node.type === 'factory' ? '#1678c9' :
    '#7556c7';

  return L.divIcon({
    className: 'route-twin-marker',
    html: `<span style="background:${color}">${symbol}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

drawMap = function () {
  const scenario = scenarios[active];

  routeTwinClearLiveMap();

  connections.forEach(([from, to]) => {
    const affected =
      scenario.affected.includes(from) ||
      scenario.affected.includes(to);

    const backup = from === 'brilliant' || to === 'brilliant';

    const line = L.polyline(
      [routeTwinLiveLocations[from], routeTwinLiveLocations[to]],
      {
        color: affected ? '#dc5151' : backup ? '#ee972d' : '#1678c9',
        weight: affected ? 5 : 4,
        opacity: 0.88,
        dashArray: affected || backup ? '10 8' : null
      }
    ).addTo(routeTwinLiveMap);

    routeTwinLiveLayers.push(line);
  });

  nodes.forEach(node => {
    const affected = scenario.affected.includes(node.id);

    const marker = L.marker(routeTwinLiveLocations[node.id], {
      icon: routeTwinLiveIcon(node, affected),
      title: node.name
    }).addTo(routeTwinLiveMap);

    marker.bindTooltip(
      `<strong>${escapeText(node.name)}</strong><br>${escapeText(node.detail)}`,
      {
        direction: 'top',
        offset: [0, -14]
      }
    );

    marker.on('click', () => {
      selected = node.id;
      render();
    });

    routeTwinLiveLayers.push(marker);
  });
};

routeTwinLiveMap.invalidateSize();
render();
