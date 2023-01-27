#import <RNReanimated/ReanimatedSensor.h>

#if __has_include(<CoreMotion/CoreMotion.h>)
@implementation ReanimatedSensor

static const double q90[] = {0, 0, -0.7071067811865475, 0.7071067811865476};
static const double q180[] = {0, 0, -1, 0};
static const double q270[] = {0, 0, -0.7071067811865475, -0.7071067811865476};

- (instancetype)init:(ReanimatedSensorType)sensorType interval:(int)interval setter:(void (^)(double[]))setter
{
  self = [super init];
  _sensorType = sensorType;
  if (interval == -1) {
    _interval = 1.0 / UIScreen.mainScreen.maximumFramesPerSecond;
  } else {
    _interval = interval / 1000.0; // in seconds
  }
  _setter = setter;
  _motionManager = [[CMMotionManager alloc] init];
  return self;
}

- (bool)initialize
{
  if (_sensorType == ACCELEROMETER) {
    return [self initializeAccelerometer];
  } else if (_sensorType == GYROSCOPE) {
    return [self initializeGyroscope];
  } else if (_sensorType == GRAVITY) {
    return [self initializeGravity];
  } else if (_sensorType == MAGNETIC_FIELD) {
    return [self initializeMagnetometer];
  } else if (_sensorType == ROTATION_VECTOR) {
    return [self initializeOrientation];
  }

  return false;
}

- (bool)initializeGyroscope
{
  if (![_motionManager isGyroAvailable]) {
    return false;
  }
  [_motionManager setGyroUpdateInterval:_interval];
  [_motionManager startGyroUpdates];
  [_motionManager
      startGyroUpdatesToQueue:[NSOperationQueue mainQueue]
                  withHandler:^(CMGyroData *sensorData, NSError *error) {
                    double currentTime = [[NSProcessInfo processInfo] systemUptime];
                    if (currentTime - self->_lastTimestamp < self->_interval) {
                      return;
                    }
                    double data[] = {sensorData.rotationRate.x, sensorData.rotationRate.y, sensorData.rotationRate.z};
                    self->_setter(data);
                    self->_lastTimestamp = currentTime;
                  }];

  return true;
}

- (bool)initializeAccelerometer
{
  if (![_motionManager isAccelerometerAvailable]) {
    return false;
  }
  [_motionManager setAccelerometerUpdateInterval:_interval];
  [_motionManager startAccelerometerUpdates];
  [_motionManager startAccelerometerUpdatesToQueue:[NSOperationQueue mainQueue]
                                       withHandler:^(CMAccelerometerData *sensorData, NSError *error) {
                                         double currentTime = [[NSProcessInfo processInfo] systemUptime];
                                         if (currentTime - self->_lastTimestamp < self->_interval) {
                                           return;
                                         }
                                         double G = 9.81;
                                         // convert G to m/s^2
                                         double data[] = {
                                             sensorData.acceleration.x * G,
                                             sensorData.acceleration.y * G,
                                             sensorData.acceleration.z * G};
                                         self->_setter(data);
                                         self->_lastTimestamp = currentTime;
                                       }];

  return true;
}

- (bool)initializeGravity
{
  if (![_motionManager isDeviceMotionAvailable]) {
    return false;
  }
  [_motionManager setDeviceMotionUpdateInterval:_interval];
  [_motionManager setShowsDeviceMovementDisplay:YES];
  [_motionManager
      startDeviceMotionUpdatesToQueue:[NSOperationQueue mainQueue]
                          withHandler:^(CMDeviceMotion *sensorData, NSError *error) {
                            double currentTime = [[NSProcessInfo processInfo] systemUptime];
                            if (currentTime - self->_lastTimestamp < self->_interval) {
                              return;
                            }
                            double G = 9.81;
                            // convert G to m/s^2
                            double data[] = {
                                sensorData.gravity.x * G, sensorData.gravity.y * G, sensorData.gravity.z * G};
                            self->_setter(data);
                            self->_lastTimestamp = currentTime;
                          }];

  return true;
}

- (bool)initializeMagnetometer
{
  if (![_motionManager isMagnetometerAvailable]) {
    return false;
  }
  [_motionManager setMagnetometerUpdateInterval:_interval];
  [_motionManager startMagnetometerUpdates];
  [_motionManager
      startMagnetometerUpdatesToQueue:[NSOperationQueue mainQueue]
                          withHandler:^(CMMagnetometerData *sensorData, NSError *error) {
                            double currentTime = [[NSProcessInfo processInfo] systemUptime];
                            if (currentTime - self->_lastTimestamp < self->_interval) {
                              return;
                            }
                            double data[] = {
                                sensorData.magneticField.x, sensorData.magneticField.y, sensorData.magneticField.z};
                            self->_setter(data);
                            self->_lastTimestamp = currentTime;
                          }];

  return true;
}

- (bool)initializeOrientation
{
  if (![_motionManager isDeviceMotionAvailable]) {
    return false;
  }
  [_motionManager setDeviceMotionUpdateInterval:_interval];

  [_motionManager setShowsDeviceMovementDisplay:YES];
  [_motionManager startDeviceMotionUpdatesUsingReferenceFrame:CMAttitudeReferenceFrameXArbitraryZVertical
                                                      toQueue:[NSOperationQueue mainQueue]
                                                  withHandler:^(CMDeviceMotion *sensorData, NSError *error) {
                                                    double currentTime = [[NSProcessInfo processInfo] systemUptime];
                                                    if (currentTime - self->_lastTimestamp < self->_interval) {
                                                      return;
                                                    }
                                                    CMAttitude *attitude = sensorData.attitude;
                                                    double data[] = {
                                                        attitude.quaternion.x,
                                                        attitude.quaternion.y,
                                                        attitude.quaternion.z,
                                                        attitude.quaternion.w,
                                                        attitude.yaw,
                                                        attitude.pitch,
                                                        attitude.roll};
                                                    [self remap:attitude outData:data];
                                                    self->_setter(data);
                                                    self->_lastTimestamp = currentTime;
                                                  }];

  return true;
}

- (void)cancel
{
  if (_sensorType == ACCELEROMETER) {
    [_motionManager stopAccelerometerUpdates];
  } else if (_sensorType == GYROSCOPE) {
    [_motionManager stopGyroUpdates];
  } else if (_sensorType == GRAVITY) {
    [_motionManager stopDeviceMotionUpdates];
  } else if (_sensorType == MAGNETIC_FIELD) {
    [_motionManager stopMagnetometerUpdates];
  } else if (_sensorType == ROTATION_VECTOR) {
    [_motionManager stopDeviceMotionUpdates];
  }
}

- (void)multiplyQuaternions:(const double*)b a:(const double*)a res:(double*)res {
  res[0] = a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3];
  res[1] = a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2];
  res[2] = a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1];
  res[3] = a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0];
}

- (void)remap:(CMAttitude*)attitude outData:(double* )data
{
  CMRotationMatrix matrix = attitude.rotationMatrix;
  CMRotationMatrix matrixRemapped;
  double adjustedQuaternion[4];
  
  UIInterfaceOrientation interfaceOrientation = [self getInterfaceOrientation];
  if(interfaceOrientation == UIInterfaceOrientationLandscapeRight) {
    CMRotationMatrix outMatrix = {
      .m11 = -matrix.m12, .m12 = matrix.m11, .m13 = matrix.m13,
      .m21 = -matrix.m22, .m22 = matrix.m21, .m23 = matrix.m23,
      .m31 = -matrix.m32, .m32 = matrix.m31, .m33 = matrix.m33
    };
    matrixRemapped = outMatrix;
    [self multiplyQuaternions:q90 a:data res:adjustedQuaternion];
  } else if(interfaceOrientation == UIInterfaceOrientationLandscapeLeft) {
    CMRotationMatrix outMatrix = {
      .m11 = matrix.m12, .m12 = -matrix.m11, .m13 = matrix.m13,
      .m21 = matrix.m22, .m22 = -matrix.m21, .m23 = matrix.m23,
      .m31 = matrix.m32, .m32 = -matrix.m31, .m33 = matrix.m33
    };
    matrixRemapped = outMatrix;
    [self multiplyQuaternions:q270 a:data res:adjustedQuaternion];
  } else if(interfaceOrientation == UIInterfaceOrientationPortraitUpsideDown) {
    CMRotationMatrix outMatrix = {
      .m11 = -matrix.m11, .m12 = -matrix.m12, .m13 = matrix.m13,
      .m21 = -matrix.m21, .m22 = -matrix.m22, .m23 = matrix.m23,
      .m31 = -matrix.m31, .m32 = -matrix.m32, .m33 = matrix.m33
    };
    matrixRemapped = outMatrix;
    [self multiplyQuaternions:q180 a:data res:adjustedQuaternion];
  } else {
    matrixRemapped = matrix;
    adjustedQuaternion[0] = data[0];
    adjustedQuaternion[1] = data[1];
    adjustedQuaternion[2] = data[2];
    adjustedQuaternion[3] = data[3];
  }
  
  double yaw = atan2(matrixRemapped.m12, matrixRemapped.m22);
  double pitch = -asin(-matrixRemapped.m32);
  double roll = -atan2(-matrixRemapped.m31, matrixRemapped.m33);
  
  data[0] = adjustedQuaternion[0];
  data[1] = adjustedQuaternion[1];
  data[2] = adjustedQuaternion[2];
  data[3] = adjustedQuaternion[3];
  data[4] = yaw;
  data[5] = pitch;
  data[6] = roll;
}

- (UIInterfaceOrientation)getInterfaceOrientation
{
  if (@available(iOS 13.0, *)) {
    return UIApplication.sharedApplication.windows.firstObject.windowScene.interfaceOrientation;
  } else {
    return UIApplication.sharedApplication.statusBarOrientation;
  }
}

@end

#else

@implementation ReanimatedSensor

- (instancetype)init:(ReanimatedSensorType)sensorType interval:(int)interval setter:(void (^)(double[]))setter
{
  self = [super init];
  return self;
}

- (bool)initialize
{
  return false;
}

- (bool)initializeGyroscope
{
  return false;
}

- (bool)initializeAccelerometer
{
  return false;
}

- (bool)initializeGravity
{
  return false;
}

- (bool)initializeMagnetometer
{
  return false;
}

- (bool)initializeOrientation
{
  return false;
}

- (void)cancel
{
}

@end
#endif
