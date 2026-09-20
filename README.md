# ChainSight Interactive Demo

This is the second ChainSight prototype: an interactive, GitHub Pages-ready supply-chain disruption simulator for fictional Aurora Electronics.

## What is interactive

- Choose from five disruption scenarios: port closure, cyclone, supplier outage, road closure, or warehouse flood.
- Click any supplier, port, factory, warehouse, or retailer to inspect its role, stock, status, and backup.
- See affected routes and locations highlighted in red.
- Compare response plans by cost, time, and risk. The recommended plan has a green border.

## Run it locally

1. Open `index.html` in a web browser.
2. Pick a disruption from the drop-down list.
3. Select **Run simulation**.
4. Click locations on the map to explore them.
5. Select **Reset** to return to normal operations.

No installation is needed.

## Publish it on GitHub Pages

1. Sign in to GitHub and create a new repository, such as `chainsight-interactive`.
2. Upload everything inside this folder: `index.html`, `styles.css`, `app.js`, and this `README.md`.
3. Open the repository **Settings**, then **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will display the public website address when deployment finishes.

## Change the scenarios

All fictional business data is in `app.js`.

- Edit `nodes` to change locations and stock levels.
- Edit `scenarios` to add, remove, or rewrite disruptions.
- Each response plan contains its cost, time, risk, and recommendation status.

Do not put real customer supply-chain data into a public GitHub repository.
