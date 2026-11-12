CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sswap

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sswap: sswap.c $(HDRS) | $(BIN)
	$(CC) sswap.c -o $(BIN)/sswap -lcublas

clean:
	rm -rf $(BIN)
