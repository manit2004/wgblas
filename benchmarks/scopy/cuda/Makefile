CC = nvcc
BIN = bin

all: $(BIN)/scopy $(BIN)/stride.scopy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/scopy: scopy.c ../../utils/helpers.h | $(BIN)
	$(CC) scopy.c -o $(BIN)/scopy -lcublas

$(BIN)/stride.scopy: stride.scopy.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.scopy.c -o $(BIN)/stride.scopy -lcublas

clean:
	rm -rf $(BIN)
