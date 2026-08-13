CC = nvcc
BIN = bin

all: $(BIN)/strsv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strsv: strsv.c ../../utils/helpers.h | $(BIN)
	$(CC) strsv.c -o $(BIN)/strsv -lcublas

clean:
	rm -rf $(BIN)
