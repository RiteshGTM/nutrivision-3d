import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, FlashMode } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../src/constants/colors";
import CameraFrame from "../../src/features/food/components/CameraFrame";
import CameraTip from "../../src/features/food/components/CameraTip";
import { analysisService } from "../../src/features/analysis/services/analysisService";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const handleCapture = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      /*
       * Temporary image URL.
       *
       * This is only for frontend/backend integration testing.
       * Later this will be replaced by the actual captured image
       * uploaded to your backend/storage.
       */
      const imageUrl =
        "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=900&q=85";

      const analysis = await analysisService.createAnalysis({
        imageUrl,
      });

      router.push({
        pathname: "/main/segmentation-review",
        params: {
          analysisId: String(analysis.id),
        },
      });
    } catch (error: any) {
      console.error("Analysis creation failed:", error);

      Alert.alert(
        "Analysis failed",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to analyze the food image.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.screen} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={colors.white} />
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.cameraPreview}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
        />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.iconButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons name="chevron-back" size={25} color={colors.white} />
            </Pressable>

            <Text style={styles.title}>Scan your food</Text>

            <Pressable
              style={[
                styles.iconButton,
                flash === "on" && styles.iconButtonActive,
              ]}
              onPress={toggleFlash}
              disabled={loading}
            >
              <Ionicons
                name={flash === "on" ? "flash" : "flash-outline"}
                size={22}
                color={flash === "on" ? "#FFD700" : colors.white}
              />
            </Pressable>
          </View>

          {/* Camera scanning frame */}
          <CameraFrame />

          {/* Instruction */}
          <View style={styles.instruction}>
            <Text style={styles.instructionTitle}>
              {loading ? "Analyzing your meal..." : "Capture your meal"}
            </Text>

            <CameraTip />
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            {/* Gallery */}
            <Pressable
              style={styles.sideButton}
              onPress={() => {}}
              disabled={loading}
            >
              <Ionicons name="images-outline" size={24} color={colors.white} />

              <Text style={styles.sideButtonText}>Gallery</Text>
            </Pressable>

            {/* Capture */}
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                pressed && !loading && styles.capturePressed,
                loading && styles.captureDisabled,
              ]}
              onPress={handleCapture}
              disabled={loading}
            >
              <View style={styles.captureInner} pointerEvents="none" />
            </Pressable>

            {/* Switch Camera Side Button */}
            <Pressable
              style={styles.sideButton}
              onPress={() =>
                setFacing((current) => (current === "back" ? "front" : "back"))
              }
              disabled={loading}
            >
              <Ionicons
                name="camera-reverse-outline"
                size={24}
                color={colors.white}
              />
              <Text style={styles.sideButtonText}>Flip</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111111",
  },

  cameraPreview: {
    flex: 1,
    backgroundColor: "#292929",
  },

  safeArea: {
    flex: 1,
  },

  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.white,
  },

  instruction: {
    position: "absolute",
    top: "68%",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  instructionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 8,
  },

  bottomControls: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    height: 92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    zIndex: 10,
  },

  sideButton: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  sideButtonText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 6,
    opacity: 0.9,
  },

  sideButtonPlaceholder: {
    width: 44,
    height: 44,
  },

  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.35)",
  },

  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "#222222",
  },

  capturePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  iconButtonActive: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  permissionText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },

  permissionButton: {
    backgroundColor: colors.primary || "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  permissionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  backButtonText: {
    color: "#888888",
    fontSize: 14,
  },
});
