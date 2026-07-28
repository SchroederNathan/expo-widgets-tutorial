# Hydration App: Start Here

This is the **starting point** for the Expo Widgets tutorial. It's a plain
[Expo Router](https://docs.expo.dev/versions/v57.0.0/sdk/router/) app on **Expo SDK 57** with one
screen: a water counter and an **Add 8 oz** button that fills toward a 64 oz goal.

There is no widget code yet. That's what you're going to add.

| Branch | What's on it |
| --- | --- |
| **`tutorial-start`** | The starting point (you are here) |
| **[`main`](https://github.com/SchroederNathan/expo-widgets-tutorial/tree/main)** | The finished app, if you get stuck or want to skip ahead |

## What you'll build

A **native iOS home screen widget**, written in TSX and compiled to real SwiftUI:

- It mirrors the app's hydration progress on the home screen.
- It has separate layouts for the small and medium widget sizes.
- Tapping it deep links back into a specific screen in the app.

No Swift, and no hand-editing Xcode targets. [`expo-widgets`](https://docs.expo.dev/versions/v57.0.0/sdk/widgets/)
generates the app extension, and [`@expo/ui/swift-ui`](https://docs.expo.dev/versions/v57.0.0/sdk/ui/)
gives you SwiftUI primitives as React components.

## Requirements

- **iOS only.** `expo-widgets` does not support Android in SDK 57.
- **macOS with Xcode**, since a widget is an app extension and needs a native build.
- **Not Expo Go.** You'll be adding `expo-dev-client` and building locally.
- Node 20+, and [Bun](https://bun.sh) if you want to use the committed `bun.lock`.

## Get set up

```sh
git clone https://github.com/SchroederNathan/expo-widgets-tutorial.git
cd expo-widgets-tutorial
git switch tutorial-start

bun install          # or: npm install / yarn
npx expo run:ios
```

You should see the counter screen, and tapping **Add 8 oz** should bump it by 8 up to 64. That's the
baseline. Now add the widget.

## The steps

Each step below is one commit on `main`, so you can diff against it at any point.

### 1. Install and configure `expo-widgets`

```sh
npx expo install expo-widgets expo-dev-client
```

`@expo/ui` comes along as a dependency of `expo-widgets`, so there's nothing extra to install for
the SwiftUI components.

In `app.json`, add a URL scheme (for the deep link later) and register the widget with the config
plugin:

```json
{
  "expo": {
    "scheme": "hydration-app",
    "plugins": [
      "expo-router",
      "expo-status-bar",
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
    ]
  }
}
```

The plugin creates the widget extension target and the App Group
(`group.<your bundleIdentifier>`) the app and widget use to share data.

Because this touched native config, rebuild with `npx expo run:ios`.

### 2. Write the widget and feed it data

Create `widgets/HydrationWidget.tsx`. Two things make it a widget instead of a regular component:
the `"widget"` directive at the top of the function body, and the `createWidget` export.

```tsx
import { Text } from "@expo/ui/swift-ui";
import { createWidget, WidgetEnvironment } from "expo-widgets";

const HydrationWidget = (props: { progress: number; goal: number }, environment: WidgetEnvironment) => {
  "widget";
  return <Text>{props.progress} oz</Text>;
};

export default createWidget("HydrationWidget", HydrationWidget);
```

The name passed to `createWidget` must match `name` in `app.json`. Only `@expo/ui/swift-ui`
primitives work in here, since React Native components won't render in a widget.

Then push data to it from `src/app/index.tsx`:

```tsx
useEffect(() => {
  HydrationWidget.updateSnapshot({ progress, goal: GOAL });
}, [progress]);
```

Add the widget to the simulator's home screen: long-press an empty area, tap **Edit → Add Widget**,
then search for **Hydration Widget**. Tap **Add 8 oz** in the app, then go back to the home screen.

From here, style it out with `ZStack`, `Capsule`, gradients, and modifiers from
`@expo/ui/swift-ui/modifiers`.

### 3. Deep link from the widget into a route

Add a `Link` inside the widget pointing at your scheme:

```tsx
<Link destination="hydration-app://hydrate">
  <Image systemName="plus.circle.fill" size={16} color="#fff" />
</Link>
```

Create `src/app/hydrate.tsx`. Expo Router matches the URL path to the file route, so no extra linking
config is needed. Tapping the widget now opens the app directly on that screen.

### 4. Tailor the layout per widget size

The widget receives a second `environment` argument. Branch on it so the small size isn't just a
squeezed medium:

```tsx
if (environment.widgetFamily === "systemSmall") {
  // compact layout
}
// medium layout
```

## If you're building to a real device

Swap `com.exponathan.hydration-app` in `app.json` for your own `ios.bundleIdentifier` before
building, and run `npx eas init` if you want to use EAS Build. `main` also has the
`extra.eas.build.experimental.ios.appExtensions` block that provisions the widget extension's
bundle identifier and App Group entitlement for cloud builds.

## License

MIT, see [LICENSE](./LICENSE).
