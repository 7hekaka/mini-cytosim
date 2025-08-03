
#include <emscripten.h>
#include "cytosim/src/sim/Meca.h"
static cytosim::Meca sim;
extern "C" {
EMSCRIPTEN_KEEPALIVE
void init_sim(int nFib,int segs,float dt){sim.init(nFib,segs);}
EMSCRIPTEN_KEEPALIVE
void step_sim(float dt){sim.step(dt);}
EMSCRIPTEN_KEEPALIVE
const float* get_coords(){return sim.coords().data();}
EMSCRIPTEN_KEEPALIVE
int get_coords_len(){return sim.coords().size();}
}
