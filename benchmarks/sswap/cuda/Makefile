CC = nvcc
BIN = bin

all: $(BIN)/sswap $(BIN)/stride.sswap

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sswap: sswap.c ../../utils/helpers.h | $(BIN)
	$(CC) sswap.c -o $(BIN)/sswap -lcublas

$(BIN)/stride.sswap: stride.sswap.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sswap.c -o $(BIN)/stride.sswap -lcublas

clean:
	rm -rf $(BIN)
