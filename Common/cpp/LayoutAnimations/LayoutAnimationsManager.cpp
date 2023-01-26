#include "LayoutAnimationsManager.h"
#include "CollectionUtils.h"
#include "Shareables.h"

#include <utility>

namespace reanimated {

void LayoutAnimationsManager::configureAnimation(
    int tag,
    const std::string &type,
    const std::string &sharedTransitionTag,
    std::shared_ptr<Shareable> config) {
  auto lock = std::unique_lock<std::mutex>(animationsMutex_);
  if (type == "entering") {
    enteringAnimations_[tag] = config;
  } else if (type == "exiting") {
    exitingAnimations_[tag] = config;
  } else if (type == "layout") {
    layoutAnimations_[tag] = config;
  } else if (type == "sharedElementTransition") {
    sharedTransitionAnimations_[tag] = config;
    sharedTransitionGroups_.try_emplace(sharedTransitionTag);
    sharedTransitionGroups_[sharedTransitionTag].push_back(tag);
  }
}

bool LayoutAnimationsManager::hasLayoutAnimation(
    int tag,
    const std::string &type) {
  auto lock = std::unique_lock<std::mutex>(animationsMutex_);
  if (type == "entering") {
    return collection::contains(enteringAnimations_, tag);
  } else if (type == "exiting") {
    return collection::contains(exitingAnimations_, tag);
  } else if (type == "layout") {
    return collection::contains(layoutAnimations_, tag);
  } else if (type == "sharedElementTransition") {
    return collection::contains(sharedTransitionAnimations_, tag);
  }
  return false;
}

void LayoutAnimationsManager::clearLayoutAnimationConfig(int tag) {
  auto lock = std::unique_lock<std::mutex>(animationsMutex_);
  enteringAnimations_.erase(tag);
  exitingAnimations_.erase(tag);
  layoutAnimations_.erase(tag);

  sharedTransitionAnimations_.erase(tag);
  for (auto &[key, group] : sharedTransitionGroups_) {
    auto position = std::find(group.begin(), group.end(), tag);
    if (position != group.end()) {
      group.erase(position);
    }
  }
}

void LayoutAnimationsManager::startLayoutAnimation(
    jsi::Runtime &rt,
    int tag,
    const std::string &type,
    const jsi::Object &values) {
  std::shared_ptr<Shareable> config, viewShareable;
  {
    auto lock = std::unique_lock<std::mutex>(animationsMutex_);
    if (type == "entering") {
      config = enteringAnimations_[tag];
    } else if (type == "exiting") {
      config = exitingAnimations_[tag];
    } else if (type == "layout") {
      config = layoutAnimations_[tag];
    } else if (type == "sharedElementTransition") {
      config = sharedTransitionAnimations_[tag];
    }
  }
  // TODO: cache the following!!
  jsi::Value layoutAnimationRepositoryAsValue =
      rt.global()
          .getPropertyAsObject(rt, "global")
          .getProperty(rt, "LayoutAnimationsManager");
  jsi::Function startAnimationForTag =
      layoutAnimationRepositoryAsValue.getObject(rt).getPropertyAsFunction(
          rt, "start");
  startAnimationForTag.call(
      rt,
      jsi::Value(tag),
      jsi::String::createFromAscii(rt, type),
      values,
      config->getJSValue(rt));
}

int LayoutAnimationsManager::findSiblingForSharedView(int tag) {
  /*
    The top screen on the stack triggers the animation, so we need to find
    the sibling view registered in the past. That's why we look backward.
   */
  for (auto const &[_, group] : sharedTransitionGroups_) {
    auto position = std::find(group.begin(), group.end(), tag);
    if (position != group.end() && position != group.begin()) {
      return *std::prev(position);
    }
  }
  return -1;
}

} // namespace reanimated
