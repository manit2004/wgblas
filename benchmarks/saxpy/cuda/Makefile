CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/saxpy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/saxpy: saxpy.c $(HDRS) | $(BIN)
	$(CC) saxpy.c -o $(BIN)/saxpy -lcublas

clean:
	rm -rf $(BIN)
