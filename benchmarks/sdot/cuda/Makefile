CC = nvcc
BIN = bin

all: $(BIN)/sdot $(BIN)/stride.sdot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sdot: sdot.c ../../utils/helpers.h | $(BIN)
	$(CC) sdot.c -o $(BIN)/sdot -lcublas

$(BIN)/stride.sdot: stride.sdot.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sdot.c -o $(BIN)/stride.sdot -lcublas

clean:
	rm -rf $(BIN)
