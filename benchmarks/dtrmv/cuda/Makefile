CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dtrmv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dtrmv: dtrmv.c $(HDRS) | $(BIN)
	$(CC) dtrmv.c -o $(BIN)/dtrmv -lcublas

clean:
	rm -rf $(BIN)
