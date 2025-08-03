
#pragma once
#include <cmath>
struct Vec2 {
    float x{}, y{};
    Vec2 operator+(Vec2 b) const {return {x+b.x, y+b.y};}
    Vec2 operator-(Vec2 b) const {return {x-b.x, y-b.y};}
    Vec2& operator+=(Vec2 b) {x+=b.x; y+=b.y; return *this;}
    Vec2& operator*=(float s){x*=s; y*=s; return *this;}
    float norm() const {return std::sqrt(x*x+y*y);}
};
inline Vec2 operator*(Vec2 v,float s){return {v.x*s,v.y*s};}
