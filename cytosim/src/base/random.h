
#pragma once
#include <random>
namespace cytosim {
inline float gauss() {
    static std::mt19937 rng(42);
    static std::normal_distribution<float> dist(0.f,1.f);
    return dist(rng);
}
}
