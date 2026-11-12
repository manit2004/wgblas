CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/daxpy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/daxpy: daxpy.c $(HDRS) | $(BIN)
	$(CC) daxpy.c -o $(BIN)/daxpy -lcublas

clean:
	rm -rf $(BIN)
