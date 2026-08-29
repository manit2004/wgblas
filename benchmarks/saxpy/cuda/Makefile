CC = nvcc
BIN = bin

all: $(BIN)/alpha.saxpy $(BIN)/saxpy $(BIN)/stride.saxpy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.saxpy: alpha.saxpy.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.saxpy.c -o $(BIN)/alpha.saxpy -lcublas

$(BIN)/saxpy: saxpy.c ../../utils/helpers.h | $(BIN)
	$(CC) saxpy.c -o $(BIN)/saxpy -lcublas

$(BIN)/stride.saxpy: stride.saxpy.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.saxpy.c -o $(BIN)/stride.saxpy -lcublas

clean:
	rm -rf $(BIN)
