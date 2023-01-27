package com.swmansion.reanimated.sensor;

import static android.content.Context.WINDOW_SERVICE;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.view.Display;
import android.view.Surface;
import android.view.WindowManager;

import com.swmansion.reanimated.NativeProxy;

public class ReanimatedSensorListener implements SensorEventListener {

  private NativeProxy.SensorSetter setter;
  private double lastRead = (double) System.currentTimeMillis();
  private final double interval;

  private float[] rotation = new float[9];
  private float[] orientation = new float[3];
  private float[] quaternion = new float[4];
  private float[] rotationMatrixAdjusted = new float[9];
  private float[] quaternionAdjusted = new float[4];

  private final static float[] q90 = new float[]{(float) 0.7071067811865476, 0, 0, (float) -0.7071067811865475};
  private final static float[] q180 = new float[]{0, 0, 0, -1};
  private final static float[] q270 = new float[]{(float) -0.7071067811865476, 0, 0, (float) -0.7071067811865475};

  private final Display display;

  ReanimatedSensorListener(NativeProxy.SensorSetter setter, double interval, Display display) {
    this.setter = setter;
    this.interval = interval;
    this.display = display;
  }

  private void multiplyQuaternions(float[] b, float[] a, float[] out) {
    out[0] = a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3];
    out[1] = a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2];
    out[2] = a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1];
    out[3] = a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0];
  }

  @Override
  public void onSensorChanged(SensorEvent event) {
    double current = (double) System.currentTimeMillis();
    if (current - lastRead < interval) {
      return;
    }
    int sensorType = event.sensor.getType();
    lastRead = current;
    if (sensorType == Sensor.TYPE_ROTATION_VECTOR) {
      SensorManager.getQuaternionFromVector(quaternion, event.values);
      SensorManager.getRotationMatrixFromVector(rotation, event.values);

      // Remap the matrix based on current device/activity rotation.
      switch (display.getRotation()) {
        case Surface.ROTATION_0:
          rotationMatrixAdjusted = rotation.clone();
          quaternionAdjusted = quaternion.clone();
          break;
        case Surface.ROTATION_90:
          SensorManager.remapCoordinateSystem(rotation,
                  SensorManager.AXIS_Y, SensorManager.AXIS_MINUS_X,
                  rotationMatrixAdjusted);
          multiplyQuaternions(q90, quaternion, quaternionAdjusted);
          break;
        case Surface.ROTATION_180:
          SensorManager.remapCoordinateSystem(rotation,
                  SensorManager.AXIS_MINUS_X, SensorManager.AXIS_MINUS_Y,
                  rotationMatrixAdjusted);
          multiplyQuaternions(q180, quaternion, quaternionAdjusted);
          break;
        case Surface.ROTATION_270:
          SensorManager.remapCoordinateSystem(rotation,
                  SensorManager.AXIS_MINUS_Y, SensorManager.AXIS_X,
                  rotationMatrixAdjusted);
          multiplyQuaternions(q270, quaternion, quaternionAdjusted);
          break;
      }

      SensorManager.getOrientation(rotationMatrixAdjusted, orientation);
      float[] data =
          new float[] {
            quaternionAdjusted[1], // qx
            quaternionAdjusted[2], // qy
            quaternionAdjusted[3], // qz
            quaternionAdjusted[0], // qw
            orientation[0], // yaw
            orientation[1], // pitch
            orientation[2] // roll
          };
      setter.sensorSetter(data);
    } else {
      setter.sensorSetter(event.values);
    }
  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}
