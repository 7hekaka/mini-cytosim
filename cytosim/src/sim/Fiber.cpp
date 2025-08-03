
#include "Fiber.h"
#include "../base/random.h"
namespace cytosim {
Fiber::Fiber(int segs,float L): segLength_(L){
    pts_.resize(segs+1);
    for(int i=0;i<=segs;++i) pts_[i]={i*L,0.f};
}
void Fiber::brownian(float dt){
    for(auto &p:pts_){
        p.x += gauss()*0.01f;
        p.y += gauss()*0.01f;
    }
}
}
