'use strict';

exports.getDeliveryInfoFromRomaneio = romaneio => {
  const newRomaneio = romaneio.replace(/\s{2,}/g, ' ');
  const romaneioSplit = newRomaneio.split(' - ');

  let orderNumber, fullAddress, clienteName, clientCode, deliveryDate;

  const treatment1 = romaneioSplit[0];
  if (treatment1) {
    var value = treatment1.replace('ROMANEIO:', '').trim();
    clientCode = value.substring(value.indexOf(' ') + 0).trim();
    orderNumber = value.replace(clientCode, '').trim();
  }

  const treatment2 = romaneioSplit[1];
  if (treatment2) {
    clienteName = treatment2.trim();
  }

  const treatment3 = romaneioSplit[2];
  if (treatment3) {
    const treatment3Split = treatment3.split('PRIORIDADE:');
    fullAddress = treatment3Split[0];

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
  if (isNaN(orderNumber) || !orderNumber || !fullAddress || !clientCode || !clienteName) {
    // console.log(romaneio);
    // console.log('------------------------------------------');

    return null;
  } else {
    return {
      orderNumber,
      fullAddress,
      clientCode,
      clienteName,
      deliveryDate
    }
  }
}

exports.getDeliveriesFromData = txtContent => {
  let deliveryList = [];

  const fullRomaneioSplit = txtContent.split('�����������������������������������������������������������������������������������������������������������������������������������������');

  console.log(fullRomaneioSplit.length)

  fullRomaneioSplit.map((romaneio, index) => {
    const result = this.getDeliveryInfoFromRomaneio(romaneio);
    if (result) {
      deliveryList.push(result);
    }
  });

  return deliveryList;
};
