CC = nvcc
BIN = bin

all: $(BIN)/strsm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strsm: strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) strsm.c -o $(BIN)/strsm -lcublas

clean:
	rm -rf $(BIN)
