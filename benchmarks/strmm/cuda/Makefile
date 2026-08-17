CC = nvcc
BIN = bin

all: $(BIN)/strmm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strmm: strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) strmm.c -o $(BIN)/strmm -lcublas

clean:
	rm -rf $(BIN)
