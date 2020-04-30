////////////////Short Term Rx Burn Analysis////////////////
////////////////By Joshua Sumers/////////////////
////////////////Edited:04/29/2019/////////////////
////////////////Based off Previous Wildfire Analysis found at: https://github.com/Joshsumers/WildfireProject/////////////////

//Set Imagery
var L5imagery = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
var L8imagery = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');

//set Fire Boundary
var Fire = ee.FeatureCollection('users/joshsumers1996/RxBurnShapes/Fire1');

//what is Fire name? This will be used in File name
var FireName = 'Fire1'; //Avoid Spaces

//Set Fire Year
var Year = 2013;

//Export Images? Set This Parameter
var EXPORTNDVI = true; // Export NDVI
var EVIEXPORT = true; //Export EVI
var NBREXPORT = true; //Export NBR

//Map Indicies?
var MapNDVI = true; //Map NDVI
var MapEVI = false; //Map EVI
var MapNBR = false; //Map NBR

//Determine Base Data
var BYEARs = ee.Date(Year+'-04-01');
var BYEARe = ee.Date(Year+'-04-30');
//First Analysis Year (year after Fire)
var Year1s = ee.Date(Year+1+'-04-01');
var Year1e = ee.Date(Year+1+'-04-30');
//Second Analysis Year (2 years after Fire)
var Year2s = ee.Date(Year+2+'-04-01');
var Year2e = ee.Date(Year+2+'-04-30');
//Third Analysis Year (3 years after Fire)
var Year3s = ee.Date(Year+3+'-04-01');
var Year3e = ee.Date(Year+3+'-04-30');
//Fourth Analysis Year (4 years after Fire)
var Year4s = ee.Date(Year+4+'-04-01');
var Year4e = ee.Date(Year+4+'-04-30');
//Fifth Analysis Year (5 Years after Fire)
var Year5s = ee.Date(Year+5+'-04-01');
var Year5e = ee.Date(Year+5+'-04-30');

//Confirm Imagery being used 
if (Year >= 2013) {
  print('Base Year is greater than 2013, using Landsat8 Data');
}
else
{
  print('Base Year is not greater than 2013, using Landsat5 Data');
}
if (Year+1 >= 2013) {
  print('Year 1 is greater than 2013, using Landsat8 Data');
}
else
{
  print('Year 1 is not greater than 2013, using Landsat5 Data');
}
if (Year+2 >= 2013) {
  print('Year 2 is greater than 2013, using Landsat8 Data');
}
else
{
  print('Year 2 is not greater than 2013, using Landsat5 Data');
}
//Acquire Base Imagery
if (Year >= 2013) {
var BImage= L8imagery
  .filter(ee.Filter.date(BYEARs,BYEARe))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
else {
var BImage= L5imagery
  .filter(ee.Filter.date(BYEARs,BYEARe))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
//Acquire Year 1 Imagery
if (Year+1 >= 2013) {
var Image1= L8imagery
  .filter(ee.Filter.date(Year1s,Year1e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
else {
var Image4= L5imagery
  .filter(ee.Filter.date(Year1s,Year1e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
//Acquire Year 2 Imagery
if (Year+2 >= 2013) {
var Image2= L8imagery
  .filter(ee.Filter.date(Year2s,Year2e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
else {
var Image2= L5imagery
  .filter(ee.Filter.date(Year2s,Year2e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
//Acquire Year 3 Imagery
var Image3= L8imagery
  .filter(ee.Filter.date(Year3s,Year3e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 4 Imagery
var Image4= L8imagery
  .filter(ee.Filter.date(Year4s,Year4e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 5 Imagery
var Image5= L8imagery
  .filter(ee.Filter.date(Year5s,Year5e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});

//Calculate NDVI Function for Landsat 5 
var CalcNDVI = function(image){
  var Ndvi = image.normalizedDifference(['B4','B3']).rename('NDVI');
  var INDVI = image.addBands(Ndvi);
  return INDVI;
}
//Calculate NDVI Function for Landsat 8 
var CalcNDVIL8 = function(image){
  var Ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
  var INDVIL8 = image.addBands(Ndvi);
  return INDVIL8;
}
//Calculate EVI for Landsat 5
var CalcEVI = function(image){
  var Evi = image.expression('2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1 ))', {
  'NIR' : image.select('B4').multiply(0.0001),
  'Red':image.select('B3').multiply(0.0001),
  'Blue':image.select('B1').multiply(0.0001)
  }).rename('EVI');
  var IEVI = image.addBands(Evi);
  return IEVI ;
}
//Calculate EVI for Landsat 8 
var CalcEVIL8 = function(image){
  var Evi = image.expression('2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1 ))', {
  'NIR' : image.select('B5').multiply(0.0001),
  'Red':image.select('B4').multiply(0.0001),
  'Blue':image.select('B2').multiply(0.0001)
  }).rename('EVI');
  var IEVIL8 = image.addBands(Evi);
  return IEVIL8 ;
}
//Calculate NBR Function for Landsat 5 
var CalcNBR = function(image){
  var Nbr = image.normalizedDifference(['B4','B7']).rename('NBR');
  var INBR = image.addBands(Nbr);
  return INBR ;
}
//Calculate NBR Function for Landsat 8 
var CalcNBRL8 = function(image){
  var Nbr = image.normalizedDifference(['B5','B7']).rename('NBR');
  var INBRL8 = image.addBands(Nbr);
  return INBRL8 ;
}

//calculate base indicies
if (Year >= 2013) {
var MbNDVI = BImage.map(CalcNDVIL8).mean().select('NDVI');
var MbEVI = BImage.map(CalcEVIL8).mean().select('EVI');
var MbNBR = BImage.map(CalcNBRL8).mean().select('NBR');
}
else {
var MbNDVI = BImage.map(CalcNDVI).mean().select('NDVI');
var MbEVI = BImage.map(CalcEVI).mean().select('EVI');
var MbNBR = BImage.map(CalcNBR).mean().select('NBR');
}
//calculate year 1 indicies
if (Year+1 >= 2013) {
var My1NDVI = Image4.map(CalcNDVIL8).mean().select('NDVI');
var My1EVI = Image4.map(CalcEVIL8).mean().select('EVI');
var My1NBR = Image4.map(CalcNBRL8).mean().select('NBR');
}
else {
var My1NDVI = Image4.map(CalcNDVI).mean().select('NDVI');
var My1EVI = Image4.map(CalcEVI).mean().select('EVI');
var My1NBR = Image4.map(CalcNBR).mean().select('NBR');
}
//calculate year 2 indicies
if (Year+2 >= 2013) {
var My2NDVI = Image4.map(CalcNDVIL8).mean().select('NDVI');
var My2EVI = Image4.map(CalcEVIL8).mean().select('EVI');
var My2NBR = Image4.map(CalcNBRL8).mean().select('NBR');
}
else {
var My2NDVI = Image2.map(CalcNDVI).mean().select('NDVI');
var My2EVI = Image2.map(CalcEVI).mean().select('EVI');
var My2NBR = Image2.map(CalcNBR).mean().select('NBR');
}
//calculate year 3 indicies
var My3NDVI = Image4.map(CalcNDVIL8).mean().select('NDVI');
var My3EVI = Image4.map(CalcEVIL8).mean().select('EVI');
var My3NBR = Image4.map(CalcNBRL8).mean().select('NBR');

//calculate year 4 indicies
var My4NDVI = Image4.map(CalcNDVIL8).mean().select('NDVI');
var My4EVI = Image4.map(CalcEVIL8).mean().select('EVI');
var My4NBR = Image4.map(CalcNBRL8).mean().select('NBR');

//calculate year 5 indicies
var My5NDVI = Image5.map(CalcNDVIL8).mean().select('NDVI');
var My5EVI = Image5.map(CalcEVIL8).mean().select('EVI');
var My5NBR = Image5.map(CalcNBRL8).mean().select('NBR');

//calculate difference in NDVI between Base data and following analysis years
var Y1NDVID = My1NDVI.subtract(MbNDVI);
var Y2NDVID = My2NDVI.subtract(MbNDVI);
var Y3NDVID = My3NDVI.subtract(MbNDVI);
var Y4NDVID = My4NDVI.subtract(MbNDVI);
var Y5NDVID = My5NDVI.subtract(MbNDVI);
//calculate difference in EVI between Base data and following analyis years
var Y1EVID = My1EVI.subtract(MbEVI);
var Y2EVID = My2EVI.subtract(MbEVI);
var Y3EVID = My3EVI.subtract(MbEVI);
var Y4EVID = My4EVI.subtract(MbEVI);
var Y5EVID = My5EVI.subtract(MbEVI);
//calculate difference in NBR between Base data and following analysis Years
var Y1NBRD = My1NBR.subtract(MbNBR);
var Y2NBRD = My2NBR.subtract(MbNBR);
var Y3NBRD = My3NBR.subtract(MbNBR);
var Y4NBRD = My4NBR.subtract(MbNBR);
var Y5NBRD = My5NBR.subtract(MbNBR);

//Set Visual Parameters
var VisNdvi = {Bands:'NDVI', min: -2, max: 2};
var VisEVI = {Bands:'EVI', min: -2, max: 2};
var VisNBR = {Bands:'NBR', min: -0.5, max: 1.3};

//Map NDVI
if (MapNDVI === true){
  Map.addLayer(Y1NDVID, VisNdvi, 'NDVI D Y1');
  Map.addLayer(Y2NDVID, VisNdvi, 'NDVI D Y2');
  Map.addLayer(Y3NDVID, VisNdvi, 'NDVI D Y3');
  Map.addLayer(Y4NDVID, VisNdvi, 'NDVI D Y4');
  Map.addLayer(Y5NDVID, VisNdvi, 'NDVI D Y5');
}

//Map EVI
if (MapEVI === true){
  Map.addLayer(Y1EVID, VisEVI, 'EVI D Y1');
  Map.addLayer(Y2EVID, VisEVI, 'EVI D Y2');
  Map.addLayer(Y3EVID, VisEVI, 'EVI D Y3');
  Map.addLayer(Y4EVID, VisEVI, 'EVI D Y4');
  Map.addLayer(Y5EVID, VisEVI, 'EVI D Y5');
}

//Map NBR
if (MapNBR === true){
Map.addLayer(Y1NBRD, VisNBR, 'NBR D Y1');
Map.addLayer(Y2NBRD, VisNBR, 'NBR D Y2');
Map.addLayer(Y3NBRD, VisNBR, 'NBR D Y3');
Map.addLayer(Y4NBRD, VisNBR, 'NBR D Y4');
Map.addLayer(Y5NBRD, VisNBR, 'NBR D Y5');
}

Map.centerObject(Fire, 11);

//Export NDVI
if (EXPORTNDVI === true){
  Export.image.toDrive({
    image: Y1NDVID,
    description: FireName+'_'+'Y1_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y2NDVID,
    description:FireName+'_'+'Y2_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y3NDVID,
    description:FireName+'_'+'Y3_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y4NDVID,
    description:FireName+'_'+'Y4_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y5NDVID,
    description:FireName+'_'+'Y5_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
}
//Export EVI
if (EVIEXPORT === true){
  Export.image.toDrive({
    image:Y1EVID,
    description:FireName+'_'+'Y1_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y2EVID,
    description:FireName+'_'+'Y2_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y3EVID,
    description:FireName+'_'+'Y3_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y4EVID,
    description:FireName+'_'+'Y4_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y5EVID,
    description:FireName+'_'+'Y5_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
}
//Export NBR
if (NBREXPORT === true){
  Export.image.toDrive({
    image:Y1NBRD,
    description:FireName+'_'+'Y1_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y2NBRD,
    description:FireName+'_'+'Y2_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y3NBRD,
    description:FireName+'_'+'Y3_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y4NBRD,
    description:FireName+'_'+'Y4_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y5NBRD,
    description:FireName+'_'+'Y5_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'RxFireAnalysis',
    fileFormat: 'GeoTIFF',
  })
}
