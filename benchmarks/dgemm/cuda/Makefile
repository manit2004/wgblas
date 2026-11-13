CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dgemm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dgemm: dgemm.c $(HDRS) | $(BIN)
	$(CC) dgemm.c -o $(BIN)/dgemm -lcublas

clean:
	rm -rf $(BIN)
