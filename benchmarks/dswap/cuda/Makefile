CC = nvcc
BIN = bin

all: $(BIN)/dswap $(BIN)/stride.dswap

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dswap: dswap.c ../../utils/helpers.h | $(BIN)
	$(CC) dswap.c -o $(BIN)/dswap -lcublas

$(BIN)/stride.dswap: stride.dswap.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dswap.c -o $(BIN)/stride.dswap -lcublas

clean:
	rm -rf $(BIN)
