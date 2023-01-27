import React from 'react';
import Animated, {
  useAnimatedStyle,
  useAnimatedSensor,
  SensorType,
} from 'react-native-reanimated';
import { View, Button, StyleSheet, Text } from 'react-native';

function eulerToMatrix(pitch: number, roll: number, yaw: number) {
  'worklet';
  const sa = Math.sin(pitch);
  const ca = Math.cos(pitch);
  const sb = Math.sin(roll);
  const cb = Math.cos(roll);
  const sy = Math.sin(yaw);
  const cy = Math.cos(yaw);

  return [
    cb * cy,
    ca * sy + sa * sb * cy,
    sa * sy - ca * sb * cy,
    0,

    -cb * sy,
    ca * cy - sa * sb * sy,
    sa * cy + ca * sb * sy,
    0,

    sb,
    -sa * cb,
    ca * cb,
    0,

    0,
    0,
    0,
    1,
  ];
}

function createIdentityMatrix() {
  'worklet';
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function reuseTranslate3dCommand(
  matrixCommand: number[],
  x: number,
  y: number,
  z: number
) {
  'worklet';
  matrixCommand[12] = x;
  matrixCommand[13] = y;
  matrixCommand[14] = z;
}

function multiplyInto(out: number[], a: number[], b: number[]) {
  'worklet';
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[4];
  const a11 = a[5];
  const a12 = a[6];
  const a13 = a[7];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  const a30 = a[12];
  const a31 = a[13];
  const a32 = a[14];
  const a33 = a[15];

  let b0 = b[0];
  let b1 = b[1];
  let b2 = b[2];
  let b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
}

function transformOrigin(
  matrix: number[],
  origin: { x: number; y: number; z: number }
) {
  'worklet';
  const { x, y, z } = origin;

  const translate = createIdentityMatrix();
  reuseTranslate3dCommand(translate, x, y, z);
  multiplyInto(matrix, translate, matrix);

  const untranslate = createIdentityMatrix();
  reuseTranslate3dCommand(untranslate, -x, -y, -z);
  multiplyInto(matrix, matrix, untranslate);
}

function quaternionToMatrix(q: number[]) {
  'worklet';
  const [x, y, z, s] = q;
  return [
    1 - 2 * y * y - 2 * z * z,
    2 * x * y - 2 * s * z,
    2 * x * z + 2 * s * y,
    0,
    2 * x * y + 2 * s * z,
    1 - 2 * x * x - 2 * z * z,
    2 * y * z - 2 * s * x,
    0,
    2 * x * z - 2 * s * y,
    2 * y * z + 2 * s * x,
    1 - 2 * x * x - 2 * y * y,
    0,
    0,
    0,
    0,
    1,
  ];
}

function eulerToQuaternion(roll: number, pitch: number, yaw: number) {
  'worklet';
  const cr = Math.cos(roll * 0.5);
  const sr = Math.sin(roll * 0.5);
  const cp = Math.cos(pitch * 0.5);
  const sp = Math.sin(pitch * 0.5);
  const cy = Math.cos(yaw * 0.5);
  const sy = Math.sin(yaw * 0.5);

  return [
    sr * cp * cy - cr * sp * sy,
    cr * sp * cy + sr * cp * sy,
    cr * cp * sy - sr * sp * cy,
    cr * cp * cy + sr * sp * sy,
  ];
}

function multiplyQuaternions(a: number[], b: number[]) {
  'worklet';
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

const sidesRotations = [
  [0, 0, 0],
  [Math.PI / 2, 0, 0],
  [-Math.PI / 2, 0, 0],
  [0, Math.PI / 2, 0],
  [0, -Math.PI / 2, 0],
  [Math.PI, 0, 0],
];

const sidesColors = [
  '#8B9576',
  '#0D519A',
  '#AF351B',
  '#555E6B',
  '#7F09E1',
  '#9DB89A',
];

function CubeWithEulerAngles() {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION);

  const sidesStyles = sidesRotations.map((rotation, i) =>
    useAnimatedStyle(() => {
      const pitch = animatedSensor.sensor.value.pitch;
      const roll = animatedSensor.sensor.value.roll;
      const yaw = animatedSensor.sensor.value.yaw;

      const sideLength = 100;
      const origin = { x: 0, y: 0, z: -sideLength / 2 };

      const it = eulerToMatrix(rotation[0], rotation[1], rotation[2]);
      const matrix = eulerToMatrix(pitch, roll, yaw);
      multiplyInto(matrix, matrix, it);
      transformOrigin(matrix, origin);

      return {
        transform: [{ perspective: 1000 }, { matrix: matrix }],
        backgroundColor: sidesColors[i],
      };
    })
  );

  return (
    <View style={componentStyle.boxContainer}>
      {sidesStyles.map((style, i) => (
        <Animated.View style={[componentStyle.box, style]} key={i}>
          <Text>Ahahaha</Text>
        </Animated.View>
      ))}
    </View>
  );
}

function CubeWithQuaternions() {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION);

  const sidesStyles = sidesRotations.map((rotation, i) =>
    useAnimatedStyle(() => {
      const sideLength = 100;
      const origin = { x: 0, y: 0, z: -sideLength / 2 };

      const q0 = eulerToQuaternion(rotation[0], rotation[1], rotation[2]);

      const q1 = [
        animatedSensor.sensor.value.qx,
        animatedSensor.sensor.value.qy,
        animatedSensor.sensor.value.qz,
        animatedSensor.sensor.value.qw,
      ];

      const q = multiplyQuaternions(q0, q1);

      const matrix = quaternionToMatrix(q);
      transformOrigin(matrix, origin);

      return {
        transform: [{ perspective: 1000 }, { matrix: matrix }],
        backgroundColor: sidesColors[i],
      };
    })
  );

  return (
    <View style={componentStyle.boxContainer}>
      {sidesStyles.map((style, i) => (
        <Animated.View style={[componentStyle.box, style]} key={i}>
          <Text>Ahahaha</Text>
        </Animated.View>
      ))}
    </View>
  );
}

export default function AnimatedStyleUpdateExample() {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION);

  const compassStyle = useAnimatedStyle(() => {
    const yaw = -animatedSensor.sensor.value.yaw;
    return {
      transform: [{ rotate: yaw + 'rad' }],
    };
  });

  return (
    <View style={componentStyle.container}>
      <Button
        title={'log data'}
        onPress={() => console.log(animatedSensor.sensor.value)}
      />
      <CubeWithQuaternions />
      <CubeWithEulerAngles />

      <View style={componentStyle.boxContainer}>
        <Animated.View style={[componentStyle.compass, compassStyle]}>
          <View style={componentStyle.arrow} />
        </Animated.View>
      </View>
    </View>
  );
}

const componentStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // flexDirection: 'row',
  },
  square: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    margin: 30,
  },
  box: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    backfaceVisibility: 'hidden',
  },
  red: {
    backgroundColor: 'red',
  },
  green: {
    backgroundColor: 'green',
  },
  blue: {
    backgroundColor: 'blue',
  },
  compass: {
    backgroundColor: 'black',
    width: 20,
    height: 100,
  },
  arrow: {
    backgroundColor: 'red',
    width: 20,
    height: 20,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  boxContainer: {
    width: 200,
    height: 200,
  },
});
