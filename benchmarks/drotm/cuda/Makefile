CC = nvcc
BIN = bin

all: $(BIN)/drotm $(BIN)/stride.drotm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/drotm: drotm.c ../../utils/helpers.h | $(BIN)
	$(CC) drotm.c -o $(BIN)/drotm -lcublas

$(BIN)/stride.drotm: stride.drotm.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.drotm.c -o $(BIN)/stride.drotm -lcublas

clean:
	rm -rf $(BIN)
