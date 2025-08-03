
EMCC = em++
SRC = ../wasm_backend.cpp ../cytosim/src/base/random.cpp ../cytosim/src/sim/Fiber.cpp ../cytosim/src/sim/Meca.cpp
CFLAGS = -std=c++17 -O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME="Module" \
-s EXPORTED_FUNCTIONS='["_init_sim","_step_sim","_get_coords","_get_coords_len"]' \
-s EXPORTED_RUNTIME_METHODS='["cwrap"]'
all:
	$(EMCC) $(SRC) $(CFLAGS) -o ../public/wasm_backend.js
