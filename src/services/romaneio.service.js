'use strict';

exports.getDeliveryInfoFromRomaneio = romaneio => {
  if (!romaneio) return null;

  const newRomaneio = romaneio.replace(/\s{2,}/g, ' ');
  const romaneioSplit = newRomaneio.split(' - ');

  let orderCode, fullAddress, customerName, customerCode, deliveryDate;

  let treatmentCount = 0;

  const treatment1 = romaneioSplit[treatmentCount];
  if (treatment1) {
    var value = treatment1.replace('ROMANEIO:', '').trim();
    const valueSplit = value.split(' ');
    orderCode = valueSplit[0];
    customerCode = valueSplit[1];

    if (isNaN(customerCode)) {
      treatmentCount++;
      customerCode = romaneioSplit[treatmentCount];
    }
  }

  treatmentCount++;

  const treatment2 = romaneioSplit[treatmentCount];
  if (treatment2) {
    customerName = treatment2.trim();
  }

  treatmentCount++;

  let treatment3 = romaneioSplit[treatmentCount];
  if (treatment3) {
    const treatment3Split = newRomaneio.split('PRIORIDADE:');

    let treatmentAddress = treatment3Split[0];
    if (treatmentAddress) {
      fullAddress = treatmentAddress.replace(treatment1, '').replace(treatment2, '').replace('-', '').replace('-', '').trim();
    }

    const text = treatment3Split[1];

    if (text) {
      const dates = text.match(/\b(\d+\/\d+\/\d+)\b/g);
      if (dates && dates[0]) {
        const date = dates[0].split('/');
        const newDate = '20' + date[2] + '-' + date[1] + '-' + date[0];
        deliveryDate = new Date(newDate);
      }
    }

  }

  // VERIFICA SE É UMA ENTREGA
  if (isNaN(orderCode) || !orderCode || !fullAddress || !customerCode || !customerName) {
    return null;
  } else {
    return {
      orderCode,
      fullAddress,
      customerCode,
      customerName,
      deliveryDate
    }
  }
}

exports.getDeliveriesFromData = txtContent => {
  let deliveryList = [];

  const fullRomaneioSplit = txtContent.split('�����������������������������������������������������������������������������������������������������������������������������������������');

  fullRomaneioSplit.map((romaneio, index) => {
    const result = this.getDeliveryInfoFromRomaneio(romaneio);
    if (result) {
      deliveryList.push(result);
    }
  });

  // const result = this.getDeliveryInfoFromRomaneio(fullRomaneioSplit[2]);
  // console.log(result);
  // deliveryList.push(result);

  return deliveryList;
};
