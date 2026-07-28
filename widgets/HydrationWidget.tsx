import { Capsule, HStack, Image, Link, Rectangle, Spacer, Text, VStack, ZStack } from "@expo/ui/swift-ui"
import { buttonStyle, containerBackground, containerRelativeFrame, font, foregroundStyle, frame, padding, tint } from "@expo/ui/swift-ui/modifiers"
import { createWidget, WidgetEnvironment } from "expo-widgets"

type HydrationWidget = {
    progress: number,
    goal: number
}

const HydrationWidget = (props: HydrationWidget, environment: WidgetEnvironment) => {
    "widget";

    const BAR_HEIGHT = 130
    const BAR_WIDTH = 30

    const ratio = props.goal > 0 ? Math.min(props.progress / props.goal, 1) : 0
    const fillHeight = BAR_HEIGHT * ratio

    if (environment.widgetFamily === "systemSmall") {
        return (
            <ZStack
                modifiers={[containerBackground("#000", "widget")]}
            >
                <Rectangle
                    modifiers={[
                        containerRelativeFrame({ axes: "both" }),
                        foregroundStyle({
                            type: "radialGradient",
                            colors: ["#1D1396", "#000"],
                            center: { x: 1, y: 1 },
                            startRadius: 0,
                            endRadius: 200,
                        }),
                    ]}
                />
                <HStack spacing={12} modifiers={[padding({ all: 16 })]}>
                    <ZStack alignment="bottom">
                        <Capsule
                            modifiers={[
                                frame({ width: BAR_WIDTH, height: BAR_HEIGHT }),
                                foregroundStyle("#FFFFFF22")
                            ]}
                        />
                        <Capsule
                            modifiers={[
                                frame({ width: BAR_WIDTH, height: fillHeight }),
                                foregroundStyle("#5d57f0")
                            ]}
                        />
                    </ZStack>
                    <Spacer />
                    <VStack alignment="trailing">
                        <Link
                            destination="hydration-app://hydrate"
                            modifiers={[buttonStyle("glassProminent"), tint("#FFFFFF22")]}
                        >
                            <Image systemName="drop.fill" size={16} color={"#fff"} />
                            <Image systemName="plus.circle.fill" size={16} color={"#fff"} />
                        </Link>
                        <Spacer />
                        <Text
                            modifiers={[
                                font({ weight: "bold", size: 32 }),
                                foregroundStyle("#fff")
                            ]}
                        >
                            {props.progress}
                        </Text>
                        <Text
                            modifiers={[
                                font({ weight: "medium", size: 16 }),
                                foregroundStyle("#fff")
                            ]}
                        >
                            oz
                        </Text>
                    </VStack>
                </HStack>
            </ZStack>
        )
    }

    return (
        <ZStack
            modifiers={[containerBackground("#000", "widget")]}
        >
            <Rectangle
                modifiers={[
                    containerRelativeFrame({ axes: "both" }),
                    foregroundStyle({
                        type: "radialGradient",
                        colors: ["#eb4034", "#000"],
                        center: { x: 1, y: 1 },
                        startRadius: 0,
                        endRadius: 200,
                    }),
                ]}
            />
            <HStack spacing={12} modifiers={[padding({ all: 16 })]}>
                <ZStack alignment="bottom">
                    <Capsule
                        modifiers={[
                            frame({ width: BAR_WIDTH, height: BAR_HEIGHT }),
                            foregroundStyle("#FFFFFF22")
                        ]}
                    />
                    <Capsule
                        modifiers={[
                            frame({ width: BAR_WIDTH, height: fillHeight }),
                            foregroundStyle("#5d57f0")
                        ]}
                    />
                </ZStack>
                <Spacer />
                <VStack alignment="trailing">
                    <Link
                        destination="hydration-app://hydrate"
                        modifiers={[buttonStyle("glassProminent"), tint("#FFFFFF22")]}
                    >
                        <Image systemName="drop.fill" size={16} color={"#fff"} />
                        <Image systemName="plus.circle.fill" size={16} color={"#fff"} />
                    </Link>
                    <Spacer />
                    <Text
                        modifiers={[
                            font({ weight: "bold", size: 32 }),
                            foregroundStyle("#fff")
                        ]}
                    >
                        {props.progress}
                    </Text>
                    <Text
                        modifiers={[
                            font({ weight: "medium", size: 16 }),
                            foregroundStyle("#fff")
                        ]}
                    >
                        oz
                    </Text>
                </VStack>
            </HStack>
        </ZStack>
    )
}

export default createWidget("HydrationWidget", HydrationWidget);
