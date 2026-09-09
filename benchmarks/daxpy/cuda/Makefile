CC = nvcc
BIN = bin

all: $(BIN)/alpha.daxpy $(BIN)/daxpy $(BIN)/stride.daxpy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.daxpy: alpha.daxpy.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.daxpy.c -o $(BIN)/alpha.daxpy -lcublas

$(BIN)/daxpy: daxpy.c ../../utils/helpers.h | $(BIN)
	$(CC) daxpy.c -o $(BIN)/daxpy -lcublas

$(BIN)/stride.daxpy: stride.daxpy.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.daxpy.c -o $(BIN)/stride.daxpy -lcublas

clean:
	rm -rf $(BIN)
