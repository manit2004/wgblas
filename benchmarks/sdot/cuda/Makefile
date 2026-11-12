CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sdot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sdot: sdot.c $(HDRS) | $(BIN)
	$(CC) sdot.c -o $(BIN)/sdot -lcublas

clean:
	rm -rf $(BIN)
