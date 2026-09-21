const accessForm = document.getElementById("access-form");
const accessScreen = document.getElementById("access-screen");
const portal = document.getElementById("portal");
const upload = document.getElementById("workbook-file");
const message = document.getElementById("upload-message");

accessForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("client-name").value.trim();

  document.getElementById("client-display").textContent = name;
  document.getElementById("client-initial").textContent =
    name.charAt(0).toUpperCase();

  accessScreen.classList.add("hidden");
  portal.classList.remove("hidden");
});

upload.addEventListener("change", async event => {
  const file = event.target.files[0];

  if (!file) return;

  if (typeof XLSX === "undefined") {
    message.textContent =
      "The workbook reader could not load. Check your internet connection and try again.";
    return;
  }

  message.textContent = `Reading ${file.name} on this device…`;

  try {
    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data, {
      type: "array",
      cellDates: true
    });

    showWorkbook(workbook, file.name);
  } catch (error) {
    console.error(error);

    message.textContent =
      "RouteTwin could not read this file. Please choose an Excel workbook (.xlsx) based on the RouteTwin template.";
  }
});

function rows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) return [];

  /*
    Find the row containing the real headings.
    This means the portal still works if title rows
    or instructions are above the table.
  */
  const rawRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: ""
  });

  const headings = {
    "Locations": "Location ID",
    "Routes & Lanes": "Lane ID",
    "Inventory": "Inventory ID",
    "Backup Options": "Backup ID"
  };

  const headingRow = rawRows.findIndex(row =>
    row.includes(headings[sheetName])
  );

  return headingRow >= 0
    ? XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        range: headingRow
      })
    : [];
}

function text(value) {
  return String(value ?? "").trim();
}

function findValue(row, label) {
  const key = Object.keys(row).find(
    column => column.toLowerCase() === label.toLowerCase()
  );

  return key ? row[key] : "";
}

function showWorkbook(workbook, filename) {
  const needed = [
    "Locations",
    "Routes & Lanes",
    "Inventory",
    "Backup Options"
  ];

  const missing = needed.filter(
    name => !workbook.SheetNames.includes(name)
  );

  const locationRows = rows(workbook, "Locations").filter(row =>
    text(findValue(row, "Location ID"))
  );

  const routeRows = rows(workbook, "Routes & Lanes").filter(row =>
    text(findValue(row, "Lane ID"))
  );

  const inventoryRows = rows(workbook, "Inventory").filter(row =>
    text(findValue(row, "Inventory ID"))
  );

  const backupRows = rows(workbook, "Backup Options").filter(row =>
    text(findValue(row, "Backup ID"))
  );

  const approved = backupRows.filter(row =>
    text(findValue(row, "Approval status"))
      .toLowerCase()
      .includes("approved")
  );

  const covers = inventoryRows
    .map(row => Number(findValue(row, "Days of cover")))
    .filter(value => Number.isFinite(value) && value > 0);

  const lowestCover = covers.length
    ? Math.min(...covers)
    : null;

  document.getElementById("location-count").textContent =
    locationRows.length || "—";

  document.getElementById("route-count").textContent =
    routeRows.length || "—";

  document.getElementById("backup-count").textContent =
    approved.length || "—";

  document.getElementById("cover-count").textContent =
    lowestCover ? `${Math.round(lowestCover)} days` : "—";

  document.getElementById("company-title").textContent =
    filename.replace(/\.(xlsx|xls)$/i, "");

  document.getElementById("last-updated").textContent =
    `Workbook loaded locally · ${new Date().toLocaleString()}`;

  message.textContent =
    `Workbook loaded successfully. ${locationRows.length} locations and ${routeRows.length} routes are ready for the next RouteTwin stage.`;

  const status = document.getElementById("check-status");
  const list = document.getElementById("check-list");

  const checks = needed.map(name => ({
    name,
    good: workbook.SheetNames.includes(name)
  }));

  if (locationRows.length === 0) {
    checks.push({
      name: "Locations tab has at least one Location ID",
      good: false
    });
  }

  if (routeRows.length === 0) {
    checks.push({
      name: "Routes & Lanes tab has at least one Lane ID",
      good: false
    });
  }

  list.innerHTML = checks
    .map(
      check =>
        `<li class="${check.good ? "ok" : "missing"}">${
          check.good
            ? `${check.name} is ready`
            : `${check.name} is missing or empty`
        }</li>`
    )
    .join("");

  if (missing.length) {
    status.textContent = "Needs attention";
    status.className = "status warning";
  } else {
    status.textContent = "Core tabs ready";
    status.className = "status good";
  }

  const locationList = document.getElementById("location-list");

  locationList.innerHTML = locationRows.length
    ? locationRows
        .slice(0, 6)
        .map(row => {
          const name =
            text(findValue(row, "Location name")) ||
            "Unnamed location";

          const type =
            text(findValue(row, "Type")) ||
            "Location";

          const city =
            text(findValue(row, "City / region"));

          const country =
            text(findValue(row, "Country"));

          return `
            <div class="location-row">
              <div>
                <b>${escapeHtml(name)}</b>
                <small>${escapeHtml(
                  [city, country].filter(Boolean).join(", ")
                )}</small>
              </div>
              <span class="location-type">${escapeHtml(type)}</span>
            </div>
          `;
        })
        .join("")
    : '<p class="empty">No valid locations found in this workbook.</p>';
}

function escapeHtml(value) {
  return value.replace(
    /[&<>'"]/g,
    character =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[character]
  );
}
