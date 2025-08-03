
#include "Meca.h"
namespace cytosim {
void Meca::init(int nFib,int segs){
    fibers_.clear();
    for(int i=0;i<nFib;++i) fibers_.emplace_back(segs,1.f);
}
void Meca::step(float dt){
    dt_=dt;
    for(auto& f:fibers_) f.brownian(dt);
}
const std::vector<float>& Meca::coords(){
    coords_.clear();
    for(auto& f:fibers_) for(auto&p:f.pts()){coords_.push_back(p.x); coords_.push_back(p.y);}
    return coords_;
}
const std::vector<float>& Meca::clLens(){clLens_.clear(); return clLens_;}
}
