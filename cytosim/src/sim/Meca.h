
#pragma once
#include <vector>
#include "Fiber.h"
#include "Couple.h"
namespace cytosim {
class Meca{
    std::vector<Fiber> fibers_;
    std::vector<Couple> cls_;
    std::vector<float> coords_;
    std::vector<float> clLens_;
    float dt_{0.01f};
public:
    void init(int nFib,int segs);
    void step(float dt);
    const std::vector<float>& coords();
    const std::vector<float>& clLens();
};
}
