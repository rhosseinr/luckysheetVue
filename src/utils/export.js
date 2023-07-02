import Excel from "exceljs";
import FileSaver from "file-saver";

const exportExcel = function (luckysheet, value) {
  const workbook = new Excel.Workbook();
  if (Object.prototype.toString.call(luckysheet) === "[object Object]") {
    luckysheet = [luckysheet];
  }
  luckysheet.forEach(function (table) {
    if (table.data.length === 0) return true;
    const worksheet = workbook.addWorksheet(table.name);
    const merge = (table.config && table.config.merge) || {};
    const borderInfo = (table.config && table.config.borderInfo) || {};
    setStyleAndValue(table.data, worksheet);
    setMerge(merge, worksheet);
    setBorder(borderInfo, worksheet);
    return true;
  });

  const buffer = workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${value}.xlsx`);
  });
  return buffer;
};

var setMerge = function (luckyMerge = {}, worksheet) {
  const mergearr = Object.values(luckyMerge);
  mergearr.forEach(function (elem) {
    worksheet.mergeCells(
      elem.r + 1,
      elem.c + 1,
      elem.r + elem.rs,
      elem.c + elem.cs
    );
  });
};

var setBorder = function (luckyBorderInfo, worksheet) {
  if (!Array.isArray(luckyBorderInfo)) return;
  luckyBorderInfo.forEach(function (elem) {
    if (elem.rangeType === "range") {
      let border = borderConvert(elem.borderType, elem.style, elem.color);
      let rang = elem.range[0];
      let row = rang.row;
      let column = rang.column;
      for (let i = row[0] + 1; i < row[1] + 2; i++) {
        for (let y = column[0] + 1; y < column[1] + 2; y++) {
          worksheet.getCell(i, y).border = border;
        }
      }
    }
    if (elem.rangeType === "cell") {
      const { col_index, row_index } = elem.value;
      const borderData = Object.assign({}, elem.value);
      delete borderData.col_index;
      delete borderData.row_index;
      let border = addborderToCell(borderData, row_index, col_index);
      worksheet.getCell(row_index + 1, col_index + 1).border = border;
    }
  });
};
var setStyleAndValue = function (cellArr, worksheet) {
  if (!Array.isArray(cellArr)) return;
  cellArr.forEach(function (row, rowid) {
    row.every(function (cell, columnid) {
      if (!cell) return true;
      let fill = fillConvert(cell.bg);

      let font = fontConvert(
        cell.ff,
        cell.fc,
        cell.bl,
        cell.it,
        cell.fs,
        cell.cl,
        cell.ul
      );
      let alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr);
      let value = "";

      if (cell.f) {
        value = { formula: cell.f, result: cell.v };
      } else if (!cell.v && cell.ct && cell.ct.s) {
        cell.ct.s.forEach((arr) => {
          value += arr.v;
        });
      } else {
        value = cell.v;
      }
      let letter = createCellPos(columnid);
      let target = worksheet.getCell(letter + (rowid + 1));
      for (const key in fill) {
        target.fill = fill;
        break;
      }
      target.font = font;
      target.alignment = alignment;
      target.value = value;

      return true;
    });
  });
};

var fillConvert = function (bg) {
  if (!bg) {
    return {};
  }
  let fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: bg.replace("#", "") },
  };
  return fill;
};

var fontConvert = function (
  ff = 0,
  fc = "#000000",
  bl = 0,
  it = 0,
  fs = 10,
  cl = 0,
  ul = 0
) {
  const luckyToExcel = {
    0: "Vazir",
    1: "Arial",
    2: "Times New Roman ",
    3: "Tahoma",
    4: "Verdana",
    num2bl: function (num) {
      return num === 0 ? false : true;
    },
  };

  let font = {
    name: typeof ff === "number" ? luckyToExcel[ff] : ff,
    family: 1,
    size: fs,
    color: { argb: fc.replace("#", "") },
    bold: luckyToExcel.num2bl(bl),
    italic: luckyToExcel.num2bl(it),
    underline: luckyToExcel.num2bl(ul),
    strike: luckyToExcel.num2bl(cl),
  };

  return font;
};

var alignmentConvert = function (
  vt = "default",
  ht = "default",
  tb = "default",
  tr = "default"
) {
  const luckyToExcel = {
    vertical: {
      0: "middle",
      1: "top",
      2: "bottom",
      default: "top",
    },
    horizontal: {
      0: "center",
      1: "left",
      2: "right",
      default: "left",
    },
    wrapText: {
      0: false,
      1: false,
      2: true,
      default: false,
    },
    textRotation: {
      0: 0,
      1: 45,
      2: -45,
      3: "vertical",
      4: 90,
      5: -90,
      default: 0,
    },
  };

  let alignment = {
    vertical: luckyToExcel.vertical[vt],
    horizontal: luckyToExcel.horizontal[ht],
    wrapText: luckyToExcel.wrapText[tb],
    textRotation: luckyToExcel.textRotation[tr],
  };
  return alignment;
};

var borderConvert = function (borderType, style = 1, color = "#000") {
  if (!borderType) {
    return {};
  }
  const luckyToExcel = {
    type: {
      "border-all": "all",
      "border-top": "top",
      "border-right": "right",
      "border-bottom": "bottom",
      "border-left": "left",
    },
    style: {
      0: "none",
      1: "thin",
      2: "hair",
      3: "dotted",
      4: "dashDot",
      5: "dashDot",
      6: "dashDotDot",
      7: "double",
      8: "medium",
      9: "mediumDashed",
      10: "mediumDashDot",
      11: "mediumDashDotDot",
      12: "slantDashDot",
      13: "thick",
    },
  };
  let template = {
    style: luckyToExcel.style[style],
    color: { argb: color.replace("#", "") },
  };
  let border = {};
  if (luckyToExcel.type[borderType] === "all") {
    border["top"] = template;
    border["right"] = template;
    border["bottom"] = template;
    border["left"] = template;
  } else {
    border[luckyToExcel.type[borderType]] = template;
  }
  return border;
};

function addborderToCell(borders, row_index, col_index) {
  let border = {};
  const luckyExcel = {
    type: {
      l: "left",
      r: "right",
      b: "bottom",
      t: "top",
    },
    style: {
      0: "none",
      1: "thin",
      2: "hair",
      3: "dotted",
      4: "dashDot",
      5: "dashDot",
      6: "dashDotDot",
      7: "double",
      8: "medium",
      9: "mediumDashed",
      10: "mediumDashDot",
      11: "mediumDashDotDot",
      12: "slantDashDot",
      13: "thick",
    },
  };
  for (const bor in borders) {
    if (borders[bor].color.indexOf("rgb") === -1) {
      border[luckyExcel.type[bor]] = {
        style: luckyExcel.style[borders[bor].style],
        color: { argb: borders[bor].color.replace("#", "") },
      };
    } else {
      border[luckyExcel.type[bor]] = {
        style: luckyExcel.style[borders[bor].style],
        color: { argb: borders[bor].color },
      };
    }
  }

  return border;
}

function createCellPos(n) {
  let ordA = "A".charCodeAt(0);

  let ordZ = "Z".charCodeAt(0);
  let len = ordZ - ordA + 1;
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;

    n = Math.floor(n / len) - 1;
  }
  return s;
}

export { exportExcel };
