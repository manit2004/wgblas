CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dswap

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dswap: dswap.c $(HDRS) | $(BIN)
	$(CC) dswap.c -o $(BIN)/dswap -lcublas

clean:
	rm -rf $(BIN)
