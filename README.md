# DimWit

Chrome extension that brings back X's Dim dark mode (#15202B) by replacing the Lights Out pure black theme.

## Install from Chrome Web Store

The extension is currently in review. The Web Store link will be posted here once it's approved.

## Install manually

1. Clone or download this repo
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `src/` folder

## How it works

DimWit uses CSS overrides and a lightweight MutationObserver to replace Lights Out colors with their Dim equivalents:

| Lights Out | Dim | Usage |
|---|---|---|
| `#000000` | `#15202B` | Main background |
| `#16181C` | `#1A2734` | Elevated surfaces |
| `#1D1F23` | `#1E2D3D` | Hover states |
| `#2F3336` | `#38444D` | Borders/dividers |
| `#202327` | `#253341` | Input fields |

CSS handles static styles, the MutationObserver catches dynamically injected inline styles as X loads content.

## Chrome Web Store publishing

The GitHub Actions workflow (`.github/workflows/publish.yml`) publishes automatically when you push a `v*` tag.

Required GitHub secrets:

| Secret | Source |
|---|---|
| `EXTENSION_ID` | Chrome Web Store dashboard |
| `CLIENT_ID` | Google Cloud Console → OAuth 2.0 |
| `CLIENT_SECRET` | Google Cloud Console → OAuth 2.0 |
| `REFRESH_TOKEN` | OAuth flow via `chrome-webstore-upload-cli` |

## License

MIT
