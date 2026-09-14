CC = nvcc
BIN = bin

all: $(BIN)/dcopy $(BIN)/stride.dcopy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dcopy: dcopy.c ../../utils/helpers.h | $(BIN)
	$(CC) dcopy.c -o $(BIN)/dcopy -lcublas

$(BIN)/stride.dcopy: stride.dcopy.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dcopy.c -o $(BIN)/stride.dcopy -lcublas

clean:
	rm -rf $(BIN)
