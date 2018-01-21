
function getPageHeader(row, completed) {
  return `
    <div class="page-header">
      Artdatabanken <span>${completed ? 'Komplett' : ''}</span>
    </div>
    <h3>
      <span class="klass">Klass:<i>${row.kingdom}</i></span>
      <span class="ordning">Ordning:<i>${row.order}</i></span>
      <span class="familj">Familj:<i>${row.family}</i></span>
    </h3>`;
}

function getDateString(rawDate) {
  if (!rawDate) return '&nbsp;';

  function pad(val) {
    return (val > 9 ? '' : '0') + val;
  }
  const date = XLSX.SSF.parse_date_code(rawDate); // eslint-disable-line
  return `${date.y}-${pad(date.m)}-${pad(date.d)}`;
}

function getCard(row) {
  // Speices
  let speices = `<span>${row.speices}</span>` || '';
  if (speices) {
    if (row.sex) {
      const hane = row.sex.toLocaleLowerCase().indexOf('hane');
      const hona = row.sex.toLocaleLowerCase().indexOf('hona');
      if (hane > hona) {
        if (hona > -1) {
          speices += '<i class="fa fa-venus"></i>';
        }
        speices += '<i class="fa fa-mars"></i>';
      } else if (hona > hane) {
        if (hane > -1) {
          speices += '<i class="fa fa-mars"></i>';
        }
        speices += '<i class="fa fa-venus"></i>';
      }
    }

    // Speices latin
    if (row.speices_latin) {
      speices += `<span>(${row.speices_latin})</span>`;
    }
  }

  let lokal = row.place || '';
  if (lokal && row.county) {
    lokal += ` (${row.county})`;
  }

  const imageSize = 500;
  const svg = `
    <div class="svg-container">
      <svg version="1.1" viewBox="0 0 500 ${imageSize}" preserveAspectRatio="xMinYMin meet" class="svg-content">
        <rect width="500" height="${imageSize}" style="fill:rgb(220,220,220);stroke-width:0;stroke:rgb(0,0,0)" />
        <circle fill="#FFFFFF" cx="50%" cy="50%" r="35%" opacity="1.0" />
      </svg>
    </div>`;

  const image = row.image
    ? `<img class='card-img-top' src='./bilder/${row.image}' alt='Card image cap'>`
    : `${svg}<div class="image-overlay-text">Saknas</div>`;

  return `
    <div class='card'>
      <div class='img-wrapper'>${image}</div>
      <div class='card-body'>
        <h5 class='card-title'>${speices || '&nbsp;'}</h5>
      </div>
      <div class='card-footer'>${lokal}<span class="float-right">${getDateString(row.date)}</span></div>
    </div>`;
}

function getCardRow(cards) {
  const DUMMY_CARD = "<div class='card dummy'></div>";
  const cardCount = (cards.match(/class='card'/g) || []).length;
  return `<div class='card-deck mb-4'>${cards}${DUMMY_CARD.repeat(3 - cardCount)}</div>`;
}

export default function getFamiliesPageAsHTML(families, showCompletedMark = true) {
  let html = '';
  let cardRow = '';
  let cardPos = 0;

  families.forEach((family) => {
    family.data.forEach((art, index, array) => {
      if (index % 9 === 0) {
        html += '<div class="page">';
        html += getPageHeader(family.data[0], family.completed && showCompletedMark);
      }

      cardPos = index % 3;
      cardRow += getCard(art);
      if (cardPos === 2 || index === array.length - 1) {
        html += getCardRow(cardRow);
        cardRow = '';
      }

      if (index === 8 || index === array.length - 1) {
        html += '</div>';
      }
    });
  });

  return html;
}

