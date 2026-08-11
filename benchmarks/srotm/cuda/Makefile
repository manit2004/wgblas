CC = nvcc
BIN = bin

all: $(BIN)/srotm $(BIN)/stride.srotm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/srotm: srotm.c ../../utils/helpers.h | $(BIN)
	$(CC) srotm.c -o $(BIN)/srotm -lcublas

$(BIN)/stride.srotm: stride.srotm.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.srotm.c -o $(BIN)/stride.srotm -lcublas

clean:
	rm -rf $(BIN)
