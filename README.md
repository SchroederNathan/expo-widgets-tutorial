# Hydration App: Expo Widgets Tutorial

A small water-tracking app that renders a **native iOS home screen widget** from React, using
[`expo-widgets`](https://docs.expo.dev/versions/v57.0.0/sdk/widgets/) and
[`@expo/ui/swift-ui`](https://docs.expo.dev/versions/v57.0.0/sdk/ui/) on **Expo SDK 57**.

You write the widget in TSX. It compiles to real SwiftUI, with no Swift and no Xcode target wrangling.

| Branch | What's on it |
| --- | --- |
| **`main`** | The finished app (you are here) |
| **[`tutorial-start`](https://github.com/SchroederNathan/expo-widgets-tutorial/tree/tutorial-start)** | The starting point: plain Expo Router app, no widget code yet |

If you want to follow along, `git switch tutorial-start` and build up to this.

## What it does

- Tap **Add 8 oz** and the counter goes up while the button fills toward a 64 oz goal.
- Every change pushes a snapshot to the widget: `HydrationWidget.updateSnapshot({ progress, goal })`.
- The widget draws a progress capsule and the current ounces, with distinct layouts for the
  `systemSmall` and `systemMedium` families.
- Tapping the drop button on the widget deep links to `hydration-app://hydrate`, which Expo Router
  resolves to `src/app/hydrate.tsx`.

## Requirements

- **iOS only.** `expo-widgets` does not support Android in SDK 57.
- **macOS with Xcode**, since a widget is an app extension and needs a native build.
- **Not Expo Go.** This needs a development build (`expo-dev-client` is already installed).
- Node 20+, and [Bun](https://bun.sh) if you want to use the committed `bun.lock`.

## Run it

```sh
bun install          # or: npm install / yarn
npx expo run:ios     # prebuilds, creates the widget target, builds, and launches
```

Then add the widget to your home screen:

1. In the simulator, go to the home screen and long-press an empty area.
2. Tap **Edit → Add Widget** (or the **+** in the top corner).
3. Search for **Hydration Widget** and add the small or medium size.
4. Open the app, tap **Add 8 oz**, and go back to the home screen to see it update.

Subsequent JS-only changes just need `npx expo start`. Changes to `app.json` or to the widget's
native surface need another `npx expo run:ios`.

## How it's wired

**`app.json`**: the config plugin declares the widget and generates the app extension target.

```json
[
  "expo-widgets",
  {
    "widgets": [
      {
        "name": "HydrationWidget",
        "displayName": "Hydration Widget",
        "description": "A simple hydration tracking widget.",
        "supportedFamilies": ["systemSmall", "systemMedium"]
      }
    ]
  }
]
```

`name` must match the string passed to `createWidget()`. The plugin also wires up the App Group
(`group.<bundleIdentifier>` by default) that lets the app and the widget share data.

**`widgets/HydrationWidget.tsx`**: the widget itself. Two things make it a widget rather than a
normal component:

- the `"widget"` directive at the top of the function body, which marks it for the widget bundle;
- `export default createWidget("HydrationWidget", HydrationWidget)`.

It reads `environment.widgetFamily` to branch on size, and only uses `@expo/ui/swift-ui` primitives
(`ZStack`, `Capsule`, `Link`, and so on), since React Native components don't render in a widget.

**`src/app/index.tsx`**: the app pushes data outward.

```tsx
useEffect(() => {
  HydrationWidget.updateSnapshot({ progress, goal: GOAL });
}, [progress]);
```

**Deep linking**: `"scheme": "hydration-app"` in `app.json` plus the widget's
`<Link destination="hydration-app://hydrate">` is all it takes. Expo Router matches the path to the
file route.

**`extra.eas.build.experimental.ios.appExtensions`** in `app.json` is only needed for EAS Build, so
it can provision the widget extension's bundle identifier and App Group entitlement.

## Project structure

```
src/app/
  _layout.tsx        Stack with the index and hydrate routes
  index.tsx          Main screen: counter, button, updateSnapshot call
  hydrate.tsx        Deep link target from the widget
widgets/
  HydrationWidget.tsx  The widget: @expo/ui/swift-ui, small + medium layouts
app.json             expo-widgets plugin config, scheme, EAS app extension
```

`ios/` and `android/` are generated and gitignored, since this project uses
[Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/).

## The tutorial, commit by commit

Each step is one commit on top of `tutorial-start`:

| Commit | Step |
| --- | --- |
| [`497ee6c`](https://github.com/SchroederNathan/expo-widgets-tutorial/commit/497ee6c) | Install `expo-widgets` and `expo-dev-client`, add the plugin config and the URL scheme |
| [`4182775`](https://github.com/SchroederNathan/expo-widgets-tutorial/commit/4182775) | Write the widget with `@expo/ui/swift-ui` and push snapshots from the app |
| [`da87e4a`](https://github.com/SchroederNathan/expo-widgets-tutorial/commit/da87e4a) | Deep link from the widget into an Expo Router route |
| [`15cb228`](https://github.com/SchroederNathan/expo-widgets-tutorial/commit/15cb228) | Branch on `widgetFamily` to tailor the small size |

## Using your own bundle identifier

If you're building to a real device or through EAS, replace `com.exponathan.hydration-app` in
three places in `app.json`:

- `ios.bundleIdentifier`
- `extra.eas.build.experimental.ios.appExtensions[0].bundleIdentifier` (keep the
  `.ExpoWidgetsTarget` suffix)
- the App Group in that same entry's `entitlements`

Also drop `extra.eas.projectId` and `owner`, or run `npx eas init` to get your own.

## Resources

- [Expo Widgets docs](https://docs.expo.dev/versions/v57.0.0/sdk/widgets/)
- [Expo UI docs](https://docs.expo.dev/versions/v57.0.0/sdk/ui/)
- [Expo Dev Client docs](https://docs.expo.dev/versions/v57.0.0/sdk/dev-client/)
- [Expo MCP docs](https://docs.expo.dev/mcp/)
- [Expo examples](https://github.com/expo/examples/)
- [create-expo-app docs](https://docs.expo.dev/more/create-expo/)
- [Expo Claude plugin](https://claude.com/plugins/expo) and [Expo skills](https://expo.dev/skills)

## License

MIT, see [LICENSE](./LICENSE).
