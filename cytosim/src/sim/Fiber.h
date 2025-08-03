
#pragma once
#include <vector>
#include "Vec2.h"
namespace cytosim {
class Fiber {
    std::vector<Vec2> pts_;
    float segLength_;
public:
    Fiber(int segs,float L);
    void brownian(float dt);
    const std::vector<Vec2>& pts() const {return pts_;}
};
}
