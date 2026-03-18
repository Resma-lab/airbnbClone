// mapboxgl.accessToken = mapToken;

//     const map = new mapboxgl.Map({
//         container: 'map', // container ID
//         center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//         zoom: 9 // starting zoom
//     });

//     //console.log(coordinates);

//     new mapboxgl.Marker({ color: 'red' })
//         .setLngLat(listing.geometry.coordinates)
//         .setPopup(
//             new mapboxgl.Popup({ offset: 25 }) // add popups
//                 .setHTML(
//                     `<h3>${listing.title}</h3><p>${listing.location}</p>`
//                 )
//         )
//         .addTo(map);
    

    

mapboxgl.accessToken = mapToken;

const coords = (listing && listing.geometry && listing.geometry.coordinates)
  ? listing.geometry.coordinates
  : [0, 0]; // fallback if no geometry

const map = new mapboxgl.Map({
  container: 'map',
  center: coords, // [lng, lat]
  zoom: 9
});

new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coords)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.title}</h4><p>${listing.location}</p>`)
  )
  .addTo(map);
